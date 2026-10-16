use std::{
    env, fs,
    os::unix::fs::OpenOptionsExt,
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};

use rusqlite::{Connection, OpenFlags};
use serde::{Deserialize, Serialize};

const MAX_GAP_SECONDS: u64 = 300;

#[derive(Clone, Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct Activity {
    pub workspace: String,
    pub file: String,
    pub active_seconds: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_active_at: Option<u64>,
    #[serde(default)]
    pub is_active: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub repo: Option<String>,
}

#[derive(Serialize, Deserialize, Clone)]
struct Session {
    workspace: String,
    file: String,
    session_start: u64,
    last_active_at: u64,
    #[serde(default)]
    repo: Option<String>,
}

#[derive(Debug, PartialEq, Eq, Clone)]
struct Observation {
    workspace: String,
    file: String,
    repo: Option<String>,
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

fn detect_github_repo(dir: &Path) -> Option<String> {
    let git_entry = dir.join(".git");
    let mut config_path = git_entry.join("config");
    if git_entry.is_file() {
        #[allow(clippy::collapsible_if)]
        if let Ok(content) = fs::read_to_string(&git_entry) {
            for line in content.lines() {
                if let Some(target) = line.strip_prefix("gitdir:") {
                    let target_path = target.trim();
                    let resolved = if Path::new(target_path).is_absolute() {
                        PathBuf::from(target_path)
                    } else {
                        dir.join(target_path)
                    };
                    config_path = resolved.join("config");
                    break;
                }
            }
        }
    }
    let config = fs::read_to_string(config_path).ok()?;
    parse_github_slug(&config)
}

fn parse_github_slug(config: &str) -> Option<String> {
    for line in config.lines() {
        let trimmed = line.trim();
        if let Some(rest) = trimmed.strip_prefix("url = ") {
            let url = rest.trim();
            let path_part = if let Some(p) = url
                .strip_prefix("https://github.com/")
                .or_else(|| url.strip_prefix("http://github.com/"))
                .or_else(|| url.strip_prefix("git@github.com:"))
                .or_else(|| url.strip_prefix("ssh://git@github.com/"))
            {
                p.trim_end_matches(".git").trim_matches('/')
            } else {
                continue;
            };
            let parts: Vec<&str> = path_part.split('/').collect();
            if parts.len() == 2 {
                let owner = parts[0];
                let repo = parts[1];
                let valid = |s: &str| {
                    !s.is_empty()
                        && s.len() <= 100
                        && s.chars().all(|ch| {
                            ch.is_ascii_alphanumeric() || ch == '-' || ch == '_' || ch == '.'
                        })
                };
                if valid(owner) && valid(repo) {
                    return Some(format!("{owner}/{repo}"));
                }
            }
        }
    }
    None
}
fn zed_process_running() -> bool {
    // Checks whether zed is running on the host via /proc.
    // When the screen is locked or running in the background, keyboard events pause
    // but Zed is still actively running.
    let Ok(entries) = fs::read_dir("/proc") else {
        return false;
    };
    for entry in entries.flatten() {
        let name = entry.file_name();
        if name
            .to_str()
            .is_some_and(|s| s.bytes().all(|b| b.is_ascii_digit()))
        {
            let comm_path = entry.path().join("comm");
            if let Ok(comm) = fs::read_to_string(comm_path) {
                let trimmed = comm.trim();
                if trimmed == "zed-editor" || trimmed == "zed" {
                    return true;
                }
            }
        }
    }
    false
}

fn sample(connection: &Connection, now: u64, allowed: &[PathBuf]) -> Option<Observation> {
    sample_inner(connection, now, allowed, zed_process_running())
}

fn sample_inner(
    connection: &Connection,
    now: u64,
    allowed: &[PathBuf],
    running: bool,
) -> Option<Observation> {
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
    // When Zed is running (even in background or with screen locked), allow up to 12 hours.
    // When Zed is closed / not running, only allow up to MAX_GAP_SECONDS.
    let max_gap = if running { 43_200 } else { MAX_GAP_SECONDS };
    if now.saturating_sub(saved_at) > max_gap || saved_at > now + 30 {
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
    let repo = detect_github_repo(Path::new(&workspace));
    let Some(path) = path else {
        return (kind == "ProjectDiff").then(|| Observation {
            workspace: workspace_name,
            file: REVIEWING_CHANGES.to_owned(),
            repo,
        });
    };
    let file_path = std::str::from_utf8(&path).ok()?;
    if !Path::new(file_path).starts_with(&workspace) {
        return None;
    }
    Some(Observation {
        workspace: workspace_name,
        file: safe_name(file_path)?,
        repo,
    })
}

fn state_path() -> Option<PathBuf> {
    let base = env::var_os("XDG_STATE_HOME")
        .map(PathBuf::from)
        .or_else(|| env::var_os("HOME").map(|home| PathBuf::from(home).join(".local/state")))?;
    Some(base.join("upayan-pc/zed.json"))
}

fn update_session(path: &Path, observation: Option<Observation>, now: u64) -> Option<Activity> {
    let old = fs::read(path)
        .ok()
        .and_then(|bytes| serde_json::from_slice::<Session>(&bytes).ok());

    match observation {
        Some(current) => {
            // Actively editing. Keep the continuous session start timestamp across files and
            // workspaces if active within MAX_GAP_SECONDS.
            let session_start = match &old {
                Some(prev)
                    if now >= prev.last_active_at
                        && now - prev.last_active_at <= MAX_GAP_SECONDS =>
                {
                    prev.session_start
                }
                _ => now,
            };

            let session = Session {
                workspace: current.workspace.clone(),
                file: current.file.clone(),
                session_start,
                last_active_at: now,
                repo: current.repo.clone(),
            };

            if let Some(parent) = path.parent() {
                fs::create_dir_all(parent).ok()?;
                fs::set_permissions(parent, std::os::unix::fs::PermissionsExt::from_mode(0o700))
                    .ok()?;
            }
            let temporary = path.with_extension("tmp");
            if let Ok(bytes) = serde_json::to_vec(&session) {
                let mut options = fs::OpenOptions::new();
                options.write(true).create(true).truncate(true).mode(0o600);
                if let Ok(mut handle) = options.open(&temporary) {
                    use std::io::Write;
                    let _ = handle.write_all(&bytes);
                    let _ = fs::rename(temporary, path);
                }
            }

            Some(Activity {
                workspace: current.workspace,
                file: current.file,
                active_seconds: now.saturating_sub(session_start).min(86_400),
                last_active_at: Some(now),
                is_active: true,
                repo: current.repo,
            })
        }
        None => {
            // Stepped away, closed editor, or idle for > 5 min.
            // Keep the last session so the website can show "Last active" rather than a blank offline state.
            let prev = old?;
            Some(Activity {
                workspace: prev.workspace,
                file: prev.file,
                active_seconds: prev
                    .last_active_at
                    .saturating_sub(prev.session_start)
                    .min(86_400),
                last_active_at: Some(prev.last_active_at),
                is_active: false,
                repo: prev.repo,
            })
        }
    }
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
    update_session(&state, observation, now)
}

#[cfg(test)]
mod tests {
    use super::*;
    use rusqlite::params;

    #[test]
    fn parses_github_slugs() {
        assert_eq!(
            parse_github_slug("url = https://github.com/upayanmazumder/upayan.dev.git\n"),
            Some("upayanmazumder/upayan.dev".into())
        );
        assert_eq!(
            parse_github_slug("url = git@github.com:797th/AI_Blog_Agent.git\n"),
            Some("797th/AI_Blog_Agent".into())
        );
        assert_eq!(
            parse_github_slug("url = https://gitlab.com/other/repo.git\n"),
            None
        );
    }

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
        let obs = |f: &str| {
            Some(Observation {
                workspace: "site".into(),
                file: f.into(),
                repo: None,
            })
        };
        let test_sample = |now, path: &str| {
            let allowed = [PathBuf::from(path)];
            sample_inner(&connection, now, &allowed, false)
        };
        assert_eq!(test_sample(1000, "/work/site"), obs("main.rs"));
        assert_eq!(test_sample(1301, "/work/site"), None);
        // When Zed process is running, 1301s (> 300s) is still active (e.g. background/locked PC):
        assert_eq!(
            sample_inner(&connection, 1301, &[PathBuf::from("/work/site")], true),
            obs("main.rs")
        );
        assert_eq!(test_sample(1000, "/work/other"), None);
        assert_eq!(test_sample(1000, "/work"), obs("main.rs"));
        assert_eq!(test_sample(1000, "/wo"), None);
        connection
            .execute("UPDATE panes SET active = 0", [])
            .unwrap();
        assert_eq!(test_sample(1000, "/work/site"), obs("main.rs"));
        connection
            .execute("UPDATE editors SET path = ?1", params![b"/work/site/.env"])
            .unwrap();
        assert_eq!(test_sample(1000, "/work/site"), None);
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
        assert_eq!(test_sample(1000, "/work/site"), obs(REVIEWING_CHANGES));
        connection
            .execute(
                "INSERT INTO workspaces VALUES (2, '/work/private', datetime(1001, 'unixepoch'), NULL)",
                [],
            )
            .unwrap();
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
        assert_eq!(test_sample(1002, "/work/site"), None);
    }

    #[test]
    fn session_duration_accumulates_across_files_and_preserves_last_active() {
        let dir = env::temp_dir().join(format!(
            "zed-test-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        let state = dir.join("zed.json");
        let obs = |f: &str| {
            Some(Observation {
                workspace: "site".into(),
                file: f.into(),
                repo: Some("owner/repo".into()),
            })
        };

        // First file opened: session starts at 1000
        let first = update_session(&state, obs("main.rs"), 1000).unwrap();
        assert_eq!(first.active_seconds, 0);
        assert!(first.is_active);
        assert_eq!(first.repo.as_deref(), Some("owner/repo"));

        // Still editing 60s later: session duration is 60s
        let second = update_session(&state, obs("main.rs"), 1060).unwrap();
        assert_eq!(second.active_seconds, 60);
        assert!(second.is_active);

        // User switches to lib.rs 30s later: session CONTINUES (active_seconds = 90s)
        let switched = update_session(&state, obs("lib.rs"), 1090).unwrap();
        assert_eq!(switched.file, "lib.rs");
        assert_eq!(switched.active_seconds, 90);
        assert!(switched.is_active);

        // User closes editor or steps away (observation is None) 60s later:
        // State is NOT wiped. It reports the last active session with is_active: false!
        let inactive = update_session(&state, None, 1150).unwrap();
        assert_eq!(inactive.file, "lib.rs");
        assert_eq!(inactive.active_seconds, 90);
        assert!(!inactive.is_active);
        assert_eq!(inactive.last_active_at, Some(1090));

        // A new session after a gap > MAX_GAP_SECONDS (300s): starts at 1500
        let restart = update_session(&state, obs("main.rs"), 1500).unwrap();
        assert_eq!(restart.active_seconds, 0);
        assert!(restart.is_active);
        fs::remove_dir_all(dir).unwrap();
    }
}
