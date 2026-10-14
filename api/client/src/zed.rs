use std::{
    env, fs,
    os::unix::fs::OpenOptionsExt,
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};

use rusqlite::{Connection, OpenFlags};
use serde::{Deserialize, Serialize};

const MAX_GAP_SECONDS: u64 = 300;

#[derive(Clone, Serialize, Deserialize)]
pub struct Activity {
    pub workspace: String,
    pub file: String,
    pub active_seconds: u64,
}

#[derive(Serialize, Deserialize)]
struct Session {
    workspace: String,
    file: String,
    since: u64,
    observed_at: u64,
}

fn safe_name(path: &str) -> Option<String> {
    let name = Path::new(path).file_name()?.to_str()?;
    if name.is_empty()
        || name.starts_with('.')
        || name.len() > 128
        || name
            .chars()
            .any(|ch| ch.is_control() || ch == '/' || ch == '\\')
    {
        return None;
    }
    Some(name.to_owned())
}

/// Shown instead of a file name while the git diff view is the active tab.
pub const REVIEWING_CHANGES: &str = "Reviewing changes";

fn sample(connection: &Connection, now: u64, allowed: &[PathBuf]) -> Option<(String, String)> {
    // Zed's private database schema can change. A failed query means no activity.
    // Select the latest workspace first, then check its exact path against the allowlist.
    let (workspace, kind, path, saved_at): (String, String, Option<Vec<u8>>, i64) = connection
        .query_row(
            "WITH current_workspace AS (
                 SELECT workspace_id, paths, timestamp FROM workspaces
                 WHERE remote_connection_id IS NULL ORDER BY timestamp DESC LIMIT 1
             )
             SELECT w.paths, i.kind, e.path, CAST(strftime('%s', w.timestamp) AS INTEGER)
             FROM current_workspace w
             JOIN panes p ON p.workspace_id = w.workspace_id
             JOIN items i ON i.workspace_id = p.workspace_id AND i.pane_id = p.pane_id AND i.active = 1
             LEFT JOIN editors e ON e.workspace_id = i.workspace_id AND e.item_id = i.item_id
             WHERE e.path IS NOT NULL OR i.kind = 'ProjectDiff'
             -- Focus can sit in a dock (terminal, agent), leaving no active pane; prefer the
             -- focused pane, then a real file over the diff view.
             ORDER BY p.active DESC, e.path IS NULL, p.pane_id LIMIT 1",
            [],
            |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
        )
        .ok()?;
    let saved_at = u64::try_from(saved_at).ok()?;
    if now.saturating_sub(saved_at) > MAX_GAP_SECONDS || saved_at > now + 30 {
        return None;
    }
    // An allowlisted directory covers itself and every workspace below it (component-wise).
    if !allowed
        .iter()
        .any(|dir| Path::new(&workspace).starts_with(dir))
    {
        return None;
    }
    let workspace_name = safe_name(&workspace)?;
    let Some(path) = path else {
        return (kind == "ProjectDiff").then(|| (workspace_name, REVIEWING_CHANGES.to_owned()));
    };
    let file_path = std::str::from_utf8(&path).ok()?;
    if !Path::new(file_path).starts_with(&workspace) {
        return None;
    }
    Some((workspace_name, safe_name(file_path)?))
}

fn state_path() -> Option<PathBuf> {
    let base = env::var_os("XDG_STATE_HOME")
        .map(PathBuf::from)
        .or_else(|| env::var_os("HOME").map(|home| PathBuf::from(home).join(".local/state")))?;
    Some(base.join("upayan-pc/zed.json"))
}

fn update_session(
    path: &Path,
    observation: Option<(String, String)>,
    now: u64,
) -> Option<Activity> {
    let old = fs::read(path)
        .ok()
        .and_then(|bytes| serde_json::from_slice::<Session>(&bytes).ok());
    let (workspace, file) = observation?;
    let since = match &old {
        Some(previous)
            if previous.workspace == workspace
                && previous.file == file
                && now >= previous.observed_at
                && now - previous.observed_at <= MAX_GAP_SECONDS =>
        {
            previous.since
        }
        _ => now,
    };
    let session = Session {
        workspace: workspace.clone(),
        file: file.clone(),
        since,
        observed_at: now,
    };
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).ok()?;
        fs::set_permissions(parent, std::os::unix::fs::PermissionsExt::from_mode(0o700)).ok()?;
    }
    let temporary = path.with_extension("tmp");
    let bytes = serde_json::to_vec(&session).ok()?;
    let mut options = fs::OpenOptions::new();
    options.write(true).create(true).truncate(true).mode(0o600);
    let mut file_handle = options.open(&temporary).ok()?;
    use std::io::Write;
    file_handle.write_all(&bytes).ok()?;
    fs::rename(temporary, path).ok()?;
    Some(Activity {
        workspace,
        file,
        active_seconds: now.saturating_sub(since).min(86_400),
    })
}

pub fn collect() -> Option<Activity> {
    let paths = env::var_os("ZED_PUBLIC_WORKSPACES")?;
    let allowed: Vec<PathBuf> = env::split_paths(&paths)
        .filter(|path| path.is_absolute() && path.is_dir())
        .collect();
    if allowed.is_empty() {
        return None;
    }
    let home = env::var_os("HOME")?;
    let db = env::var_os("XDG_DATA_HOME")
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from(home).join(".local/share"))
        .join("zed/db/0-stable/db.sqlite");
    let now = SystemTime::now().duration_since(UNIX_EPOCH).ok()?.as_secs();
    let state = state_path()?;
    let observation = Connection::open_with_flags(db, OpenFlags::SQLITE_OPEN_READ_ONLY)
        .ok()
        .and_then(|connection| sample(&connection, now, &allowed));
    if observation.is_none() {
        let _ = fs::remove_file(state);
        return None;
    }
    update_session(&state, observation, now)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rusqlite::params;

    #[test]
    fn reads_only_recent_allowlisted_active_file() {
        let connection = Connection::open_in_memory().unwrap();
        connection.execute_batch("CREATE TABLE workspaces (workspace_id INTEGER, paths TEXT, timestamp TEXT, remote_connection_id INTEGER);
            CREATE TABLE panes (workspace_id INTEGER, pane_id INTEGER, active INTEGER);
            CREATE TABLE items (workspace_id INTEGER, pane_id INTEGER, item_id INTEGER, active INTEGER, kind TEXT DEFAULT 'Editor');
            CREATE TABLE editors (workspace_id INTEGER, item_id INTEGER, path BLOB);").unwrap();
        connection.execute("INSERT INTO workspaces VALUES (1, '/work/site', datetime(1000, 'unixepoch'), NULL)", []).unwrap();
        connection
            .execute("INSERT INTO panes VALUES (1, 1, 1)", [])
            .unwrap();
        connection
            .execute(
                "INSERT INTO items (workspace_id, pane_id, item_id, active) VALUES (1, 1, 1, 1)",
                [],
            )
            .unwrap();
        connection
            .execute(
                "INSERT INTO editors VALUES (1, 1, ?1)",
                params![b"/work/site/src/main.rs"],
            )
            .unwrap();
        assert_eq!(
            sample(&connection, 1000, &[PathBuf::from("/work/site")]),
            Some(("site".into(), "main.rs".into()))
        );
        assert_eq!(
            sample(&connection, 1301, &[PathBuf::from("/work/site")]),
            None
        );
        assert_eq!(
            sample(&connection, 1000, &[PathBuf::from("/work/other")]),
            None
        );
        assert_eq!(
            sample(&connection, 1000, &[PathBuf::from("/work")]),
            Some(("site".into(), "main.rs".into()))
        );
        assert_eq!(sample(&connection, 1000, &[PathBuf::from("/wo")]), None);
        connection
            .execute("UPDATE panes SET active = 0", [])
            .unwrap();
        assert_eq!(
            sample(&connection, 1000, &[PathBuf::from("/work/site")]),
            Some(("site".into(), "main.rs".into()))
        );
        connection
            .execute("UPDATE editors SET path = ?1", params![b"/work/site/.env"])
            .unwrap();
        assert_eq!(
            sample(&connection, 1000, &[PathBuf::from("/work/site")]),
            None
        );
        connection
            .execute(
                "UPDATE editors SET path = ?1",
                params![b"/work/site/src/main.rs"],
            )
            .unwrap();
        // The git diff view is the active tab: report the workspace, not a stale file.
        connection
            .execute("UPDATE items SET active = 0", [])
            .unwrap();
        connection
            .execute("INSERT INTO items VALUES (1, 1, 9, 1, 'ProjectDiff')", [])
            .unwrap();
        assert_eq!(
            sample(&connection, 1000, &[PathBuf::from("/work/site")]),
            Some(("site".into(), REVIEWING_CHANGES.into()))
        );
        connection.execute("INSERT INTO workspaces VALUES (2, '/work/private', datetime(1001, 'unixepoch'), NULL)", []).unwrap();
        connection
            .execute("INSERT INTO panes VALUES (2, 2, 1)", [])
            .unwrap();
        connection
            .execute(
                "INSERT INTO items (workspace_id, pane_id, item_id, active) VALUES (2, 2, 2, 1)",
                [],
            )
            .unwrap();
        connection
            .execute(
                "INSERT INTO editors VALUES (2, 2, ?1)",
                params![b"/work/private/key.txt"],
            )
            .unwrap();
        assert_eq!(
            sample(&connection, 1002, &[PathBuf::from("/work/site")]),
            None
        );
    }

    #[test]
    fn session_duration_resets_after_file_change_or_gap() {
        let dir = env::temp_dir().join(format!(
            "zed-test-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        let state = dir.join("zed.json");
        let observation = || Some(("site".into(), "main.rs".into()));
        assert_eq!(
            update_session(&state, observation(), 1000)
                .unwrap()
                .active_seconds,
            0
        );
        assert_eq!(
            update_session(&state, observation(), 1060)
                .unwrap()
                .active_seconds,
            60
        );
        assert_eq!(
            update_session(&state, Some(("site".into(), "lib.rs".into())), 1090)
                .unwrap()
                .active_seconds,
            0
        );
        assert_eq!(
            update_session(&state, observation(), 1400)
                .unwrap()
                .active_seconds,
            0
        );
        fs::remove_dir_all(dir).unwrap();
    }
}
