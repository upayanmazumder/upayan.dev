use std::{
    sync::Arc,
    time::{SystemTime, UNIX_EPOCH},
};

use axum::{
    Json,
    body::Bytes,
    extract::State,
    http::{HeaderMap, StatusCode},
};
use hmac::{Hmac, Mac};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use sha2::Sha256;
use tokio::sync::Mutex;

type HmacSha256 = Hmac<Sha256>;

#[derive(Clone, Serialize, Deserialize)]
pub struct ZedActivity {
    pub workspace: String,
    pub file: String,
    pub active_seconds: u64,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_active_at: Option<u64>,
    #[serde(default)]
    pub is_active: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub repo: Option<String>,
}

impl ZedActivity {
    fn valid(&self) -> bool {
        [&self.workspace, &self.file].into_iter().all(|name| {
            !name.is_empty()
                && name.len() <= 128
                && name != "."
                && name != ".."
                && !name
                    .chars()
                    .any(|ch| ch.is_control() || ch == '/' || ch == '\\')
        }) && self.repo.as_ref().is_none_or(|r| {
            !r.is_empty()
                && r.len() <= 128
                && r.chars().all(|ch| {
                    ch.is_ascii_alphanumeric() || ch == '-' || ch == '_' || ch == '.' || ch == '/'
                })
                && r.split('/').count() == 2
        })
    }
}

#[derive(Clone, Serialize, Deserialize)]
pub struct Report {
    pub cpu_percent: f64,
    pub memory_used_bytes: u64,
    pub memory_total_bytes: u64,
    pub disk_used_bytes: u64,
    pub disk_total_bytes: u64,
    pub uptime_seconds: u64,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub zed: Option<ZedActivity>,
}

impl Report {
    fn valid(&self) -> bool {
        self.cpu_percent.is_finite()
            && (0.0..=100.0).contains(&self.cpu_percent)
            && self.memory_total_bytes > 0
            && self.memory_used_bytes <= self.memory_total_bytes
            && self.disk_total_bytes > 0
            && self.disk_used_bytes <= self.disk_total_bytes
            && self.zed.as_ref().is_none_or(ZedActivity::valid)
    }
}

struct LastReport {
    signed_at: u64,
    received_at: u64,
    data: Report,
}

pub struct Pc {
    id: String,
    key: Vec<u8>,
    last: Mutex<Option<LastReport>>,
}

impl Pc {
    pub fn new(id: String, key: String) -> Self {
        Self {
            id,
            key: key.into_bytes(),
            last: Mutex::new(None),
        }
    }
}

pub type SharedPc = Arc<Pc>;

fn now() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

pub async fn ingest(
    State(pc): State<SharedPc>,
    headers: HeaderMap,
    body: Bytes,
) -> (StatusCode, Json<Value>) {
    let unauthorized = || {
        (
            StatusCode::UNAUTHORIZED,
            Json(json!({"error":"invalid report signature"})),
        )
    };
    let Some(id) = headers.get("x-pc-id").and_then(|v| v.to_str().ok()) else {
        return unauthorized();
    };
    let Some(stamp) = headers.get("x-timestamp").and_then(|v| v.to_str().ok()) else {
        return unauthorized();
    };
    let Some(signature) = headers.get("x-signature").and_then(|v| v.to_str().ok()) else {
        return unauthorized();
    };
    let Ok(timestamp) = stamp.parse::<u64>() else {
        return unauthorized();
    };
    if id != pc.id || now().abs_diff(timestamp) > 300 {
        return unauthorized();
    }
    let Ok(signature) = hex::decode(signature) else {
        return unauthorized();
    };
    let mut mac = HmacSha256::new_from_slice(&pc.key).expect("HMAC accepts every key length");
    mac.update(stamp.as_bytes());
    mac.update(b"\n");
    mac.update(id.as_bytes());
    mac.update(b"\n");
    mac.update(&body);
    if mac.verify_slice(&signature).is_err() {
        return unauthorized();
    }
    let Ok(report) = serde_json::from_slice::<Report>(&body) else {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"invalid report"})),
        );
    };
    if !report.valid() {
        return (
            StatusCode::BAD_REQUEST,
            Json(json!({"error":"invalid report"})),
        );
    }
    let mut last = pc.last.lock().await;
    if last.as_ref().is_some_and(|old| timestamp <= old.signed_at) {
        return unauthorized();
    }
    *last = Some(LastReport {
        signed_at: timestamp,
        received_at: now(),
        data: report,
    });
    (StatusCode::ACCEPTED, Json(json!({"status":"accepted"})))
}

pub async fn status(State(pc): State<SharedPc>) -> Json<Value> {
    let last = pc.last.lock().await;
    match last.as_ref() {
        Some(report) => Json(json!({
            "online": now().saturating_sub(report.received_at) <= 180,
            "lastSeen": report.received_at,
            "stats": report.data
        })),
        None => Json(json!({"online":false,"lastSeen":null,"stats":null})),
    }
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zed_activity_rejects_paths_and_control_characters() {
        let mut activity = ZedActivity {
            workspace: "site".into(),
            file: "main.rs".into(),
            active_seconds: 42,
            last_active_at: Some(1000),
            is_active: true,
            repo: Some("owner/repo".into()),
        };
        assert!(activity.valid());
        activity.repo = Some("invalid/repo/extra".into());
        assert!(!activity.valid());
        activity.repo = Some("owner/repo".into());
        activity.file = "../secret".into();
        assert!(!activity.valid());
        activity.file = "secret\n.env".into();
        assert!(!activity.valid());
        activity.file = "main.rs".into();
        activity.active_seconds = 86_401;
        assert!(activity.valid());
    }
}
