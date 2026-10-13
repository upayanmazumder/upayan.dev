mod devjourney;
mod discord;
mod pc;
mod spotify;

use std::{
    env,
    future::Future,
    net::SocketAddr,
    sync::Arc,
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};

use axum::{
    Json, Router,
    extract::{DefaultBodyLimit, State},
    http::{HeaderValue, StatusCode, header},
    response::IntoResponse,
    routing::{get, post},
};
use serde::Serialize;
use serde_json::{Value, json};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;

type CachedValue = Result<Arc<Value>, String>;

struct Cache {
    value: Mutex<Option<(Instant, CachedValue)>>,
    ttl: Duration,
}

impl Cache {
    fn new(ttl: Duration) -> Self {
        Self {
            value: Mutex::new(None),
            ttl,
        }
    }

    async fn get<F, Fut, T>(&self, fetch: F) -> Result<Arc<Value>, String>
    where
        F: FnOnce() -> Fut,
        Fut: Future<Output = Result<T, String>>,
        T: Serialize,
    {
        let mut slot = self.value.lock().await;
        if let Some((at, value)) = slot.as_ref()
            && at.elapsed() < self.ttl
        {
            return value.clone();
        }
        let value = fetch().await.and_then(|data| {
            serde_json::to_value(data)
                .map(Arc::new)
                .map_err(|_| "serialization failed".to_owned())
        });
        *slot = Some((Instant::now(), value.clone()));
        value
    }
}

struct AppState {
    spotify: Option<spotify::Spotify>,
    discord: Option<discord::Discord>,
    pc: Option<pc::SharedPc>,
    devjourney: Arc<devjourney::DevJourney>,
    spotify_cache: Cache,
    discord_cache: Cache,
}

type Shared = Arc<AppState>;

async fn spotify_data(state: &AppState) -> Option<Result<Arc<Value>, String>> {
    match &state.spotify {
        Some(provider) => Some(state.spotify_cache.get(|| provider.fetch()).await),
        None => None,
    }
}

async fn discord_data(state: &AppState) -> Option<Result<Arc<Value>, String>> {
    match &state.discord {
        Some(provider) => Some(state.discord_cache.get(|| provider.fetch()).await),
        None => None,
    }
}

fn provider_result(result: Option<Result<Arc<Value>, String>>) -> (StatusCode, Json<Value>) {
    match result {
        Some(Ok(data)) => (StatusCode::OK, Json(json!({ "data": data, "error": null }))),
        Some(Err(error)) => (
            StatusCode::BAD_GATEWAY,
            Json(json!({ "data": null, "error": error })),
        ),
        None => (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(json!({ "data": null, "error": "provider not configured" })),
        ),
    }
}

async fn spotify_route(State(state): State<Shared>) -> impl IntoResponse {
    provider_result(spotify_data(&state).await)
}

async fn discord_route(State(state): State<Shared>) -> impl IntoResponse {
    provider_result(discord_data(&state).await)
}

async fn pc_route(State(state): State<Shared>) -> impl IntoResponse {
    match &state.pc {
        Some(pc) => (StatusCode::OK, pc::status(State(pc.clone())).await).into_response(),
        None => (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(json!({"error":"PC not configured"})),
        )
            .into_response(),
    }
}
async fn stats(State(state): State<Shared>) -> impl IntoResponse {
    let (spotify, discord) = tokio::join!(spotify_data(&state), discord_data(&state));
    let failed =
        !matches!(spotify, Some(Ok(_))) && !matches!(discord, Some(Ok(_))) && state.pc.is_none();
    let (spotify_data, spotify_error) = split(spotify);
    let (discord_data, discord_error) = split(discord);
    let pc_data = match &state.pc {
        Some(pc) => pc::status(State(pc.clone())).await.0,
        None => json!({"online":false,"lastSeen":null,"stats":null}),
    };
    let status = if failed {
        StatusCode::BAD_GATEWAY
    } else {
        StatusCode::OK
    };
    (
        status,
        Json(json!({
            "spotify": spotify_data,
            "discord": discord_data,
            "pc": pc_data,
            "errors": { "spotify": spotify_error, "discord": discord_error },
            "timestamp": SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_secs()
        })),
    )
}

fn split(result: Option<Result<Arc<Value>, String>>) -> (Option<Arc<Value>>, Option<String>) {
    match result {
        Some(Ok(value)) => (Some(value), None),
        Some(Err(error)) => (None, Some(error)),
        None => (None, Some("provider not configured".to_owned())),
    }
}

async fn health() -> Json<Value> {
    Json(json!({ "status": "ok" }))
}

fn router(state: Shared, origin: Option<HeaderValue>) -> Router {
    let mut app = Router::new()
        .route("/health", get(health))
        .route("/api/stats", get(stats))
        .route("/api/stats/spotify", get(spotify_route))
        .route("/api/stats/discord", get(discord_route))
        .route("/api/stats/pc", get(pc_route))
        .with_state(state.clone());
    app = app.merge(
        Router::new()
            .route("/devjourney", get(devjourney::proxy))
            .with_state(state.devjourney.clone()),
    );
    if let Some(pc) = &state.pc {
        app = app.merge(
            Router::new()
                .route("/api/pc/report", post(pc::ingest))
                .layer(DefaultBodyLimit::max(4096))
                .with_state(pc.clone()),
        );
    }
    if let Some(origin) = origin {
        app = app.layer(
            CorsLayer::new()
                .allow_origin(origin)
                .allow_methods([axum::http::Method::GET])
                .allow_headers([header::CONTENT_TYPE]),
        );
    }
    app
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(8))
        .redirect(reqwest::redirect::Policy::none())
        .build()?;
    let id = env::var("SPOTIFY_CLIENT_ID").unwrap_or_default();
    let secret = env::var("SPOTIFY_CLIENT_SECRET").unwrap_or_default();
    let refresh = env::var("SPOTIFY_REFRESH_TOKEN").unwrap_or_default();
    let spotify = if id.is_empty() && secret.is_empty() && refresh.is_empty() {
        None
    } else if id.is_empty() || secret.is_empty() || refresh.is_empty() {
        return Err(
            "Spotify requires SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and SPOTIFY_REFRESH_TOKEN"
                .into(),
        );
    } else {
        Some(spotify::Spotify::new(
            client.clone(),
            id,
            secret,
            refresh,
            env::var("SPOTIFY_API_BASE")
                .unwrap_or_else(|_| "https://api.spotify.com/v1".to_owned()),
            env::var("SPOTIFY_TOKEN_URL")
                .unwrap_or_else(|_| "https://accounts.spotify.com/api/token".to_owned()),
        ))
    };
    let discord_id = env::var("DISCORD_USER_ID").ok().filter(|id| !id.is_empty());
    if discord_id
        .as_ref()
        .is_some_and(|id| !id.bytes().all(|byte| byte.is_ascii_digit()))
    {
        return Err("DISCORD_USER_ID must contain only digits".into());
    }
    let discord = discord_id.map(|id| {
        discord::Discord::new(
            client.clone(),
            id,
            env::var("DISCORD_API_BASE")
                .unwrap_or_else(|_| "https://api.lanyard.rest/v1".to_owned()),
        )
    });
    let pc_id = env::var("PC_ID").unwrap_or_else(|_| "main".to_owned());
    let pc_key = env::var("SIGNING_KEY").unwrap_or_default();
    let pc = if pc_key.is_empty() {
        None
    } else if pc_id.is_empty()
        || pc_id.len() > 64
        || !pc_id
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
        || pc_key.len() < 32
    {
        return Err("PC_ID must be 1-64 letters, digits, hyphens, or underscores; SIGNING_KEY needs at least 32 bytes".into());
    } else {
        Some(Arc::new(pc::Pc::new(pc_id, pc_key)))
    };
    if spotify.is_none() && discord.is_none() && pc.is_none() {
        return Err("configure Spotify, Discord, or PC reporting".into());
    }
    let origin = env::var("CORS_ORIGIN")
        .ok()
        .filter(|s| !s.is_empty())
        .map(|s| s.parse::<HeaderValue>())
        .transpose()?;
    let addr: SocketAddr = format!(
        "{}:{}",
        env::var("BIND_HOST").unwrap_or_else(|_| "127.0.0.1".to_owned()),
        env::var("PORT").unwrap_or_else(|_| "8080".to_owned())
    )
    .parse()?;
    let owner = env::var("DEVJOURNEY_REPO_OWNER").unwrap_or_else(|_| "upayanmazumder".to_owned());
    let repo = env::var("DEVJOURNEY_REPO_NAME").unwrap_or_else(|_| "DevJourney".to_owned());
    if !devjourney::valid_repo_part(&owner) || !devjourney::valid_repo_part(&repo) {
        return Err("invalid DevJourney repository owner or name".into());
    }
    let devjourney = Arc::new(devjourney::DevJourney::new(
        client,
        owner,
        repo,
        env::var("DEVJOURNEY_GITHUB_TOKEN")
            .ok()
            .filter(|token| !token.is_empty()),
        env::var("DEVJOURNEY_API_BASE").unwrap_or_else(|_| "https://api.github.com".to_owned()),
    ));
    let state = Arc::new(AppState {
        spotify,
        discord,
        pc,
        devjourney,
        spotify_cache: Cache::new(Duration::from_secs(60)),
        discord_cache: Cache::new(Duration::from_secs(15)),
    });
    let listener = tokio::net::TcpListener::bind(addr).await?;
    println!("stats API listening on {}", listener.local_addr()?);
    axum::serve(listener, router(state, origin)).await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::routing::post;
    use std::sync::atomic::{AtomicUsize, Ordering};

    async fn serve(app: Router) -> String {
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        tokio::spawn(async move { axum::serve(listener, app).await.unwrap() });
        format!("http://{addr}")
    }

    #[tokio::test]
    async fn combined_stats_keep_partial_data_and_hide_provider_private_fields() {
        let token_calls = Arc::new(AtomicUsize::new(0));
        let calls = token_calls.clone();
        let upstream = Router::new()
            .route("/token", post(move || {
                let calls = calls.clone();
                async move {
                    calls.fetch_add(1, Ordering::SeqCst);
                    Json(json!({"access_token":"secret-access","expires_in":3600}))
                }
            }))
            .route("/v1/me/player/currently-playing", get(|| async { StatusCode::NO_CONTENT }))
            .route("/v1/me/player", get(|| async { Json(json!({"shuffle_state":false,"repeat_state":"off"})) }))
            .route("/v1/me/player/recently-played", get(|| async { Json(json!({"items":[]})) }))
            .route("/v1/me/top/{kind}", get(|| async { Json(json!({"items":[]})) }))
            .route("/v1/users/123", get(|| async {
                Json(json!({"success":true,"data":{
                    "discord_status":"online",
                    "discord_user":{"id":"123","username":"tester","avatar":null,"email":"private"},
                    "activities":[{"type":4,"name":"Custom Status","state":"Writing","emoji":{"name":"code"},"session_id":"private"}],
                    "kv":{"secret":"private"},
                    "active_on_discord_web":true
                }}))
            }));
        let base = serve(upstream).await;
        let client = reqwest::Client::new();
        let state = Arc::new(AppState {
            spotify: Some(spotify::Spotify::new(
                client.clone(),
                "id".into(),
                "secret".into(),
                "refresh".into(),
                format!("{base}/v1"),
                format!("{base}/token"),
            )),
            discord: Some(discord::Discord::new(
                client.clone(),
                "123".into(),
                format!("{base}/v1"),
            )),
            pc: None,
            devjourney: Arc::new(devjourney::DevJourney::new(
                client.clone(),
                "owner".into(),
                "repo".into(),
                None,
                base.clone(),
            )),
            spotify_cache: Cache::new(Duration::from_secs(60)),
            discord_cache: Cache::new(Duration::from_secs(15)),
        });
        let url = serve(router(state, None)).await;
        let result: Value = client
            .get(format!("{url}/api/stats"))
            .send()
            .await
            .unwrap()
            .json()
            .await
            .unwrap();
        assert_eq!(result["spotify"]["playback"]["isPlaying"], false);
        assert_eq!(result["spotify"]["playback"]["shuffle"], false);
        assert_eq!(result["spotify"]["topArtists"]["short_term"], json!([]));
        assert_eq!(result["discord"]["activities"][0]["state"], "Writing");
        assert_eq!(result["discord"]["activities"][0]["emoji"]["name"], "code");
        assert_eq!(result["discord"]["active_on_discord_web"], true);
        assert!(result["discord"].get("kv").is_none());
        assert!(
            result["discord"]["activities"][0]
                .get("session_id")
                .is_none()
        );
        assert!(result["discord"]["discord_user"].get("email").is_none());
        let second = client
            .get(format!("{url}/api/stats/spotify"))
            .send()
            .await
            .unwrap();
        assert_eq!(second.status(), StatusCode::OK);
        assert_eq!(token_calls.load(Ordering::SeqCst), 1);
    }

    #[tokio::test]
    async fn failed_spotify_does_not_erase_discord() {
        let upstream = Router::new()
            .route(
                "/token",
                post(|| async { Json(json!({"access_token":"test","expires_in":3600})) }),
            )
            .route("/v1/me/{*rest}", get(|| async { StatusCode::BAD_GATEWAY }))
            .route(
                "/v1/users/123",
                get(|| async {
                    Json(json!({"success":true,"data":{
                        "discord_status":"offline","discord_user":{"id":"123","username":"tester"}
                    }}))
                }),
            );
        let base = serve(upstream).await;
        let client = reqwest::Client::new();
        let state = Arc::new(AppState {
            spotify: Some(spotify::Spotify::new(
                client.clone(),
                "id".into(),
                "secret".into(),
                "refresh".into(),
                format!("{base}/v1"),
                format!("{base}/token"),
            )),
            discord: Some(discord::Discord::new(
                client.clone(),
                "123".into(),
                format!("{base}/v1"),
            )),
            pc: None,
            devjourney: Arc::new(devjourney::DevJourney::new(
                client.clone(),
                "owner".into(),
                "repo".into(),
                None,
                base.clone(),
            )),
            spotify_cache: Cache::new(Duration::from_secs(60)),
            discord_cache: Cache::new(Duration::from_secs(15)),
        });
        let url = serve(router(state, None)).await;
        let response = client.get(format!("{url}/api/stats")).send().await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let body: Value = response.json().await.unwrap();
        assert!(body["spotify"].is_null());
        assert_eq!(body["discord"]["discord_status"], "offline");
        assert_eq!(body["errors"]["spotify"], "Spotify endpoints unavailable");
        let spotify_only = client
            .get(format!("{url}/api/stats/spotify"))
            .send()
            .await
            .unwrap();
        assert_eq!(spotify_only.status(), StatusCode::BAD_GATEWAY);
    }
    #[tokio::test]
    async fn pc_report_requires_signature_and_rejects_replay() {
        use hmac::{Hmac, Mac};
        let client = reqwest::Client::new();
        let state = Arc::new(AppState {
            spotify: None,
            discord: None,
            pc: Some(Arc::new(pc::Pc::new("main".into(), "a".repeat(32)))),
            devjourney: Arc::new(devjourney::DevJourney::new(
                client.clone(),
                "owner".into(),
                "repo".into(),
                None,
                "http://127.0.0.1:1".into(),
            )),
            spotify_cache: Cache::new(Duration::from_secs(60)),
            discord_cache: Cache::new(Duration::from_secs(15)),
        });
        let url = serve(router(state, None)).await;
        let body = json!({"cpu_percent":25.0,"memory_used_bytes":20,"memory_total_bytes":100,
            "disk_used_bytes":30,"disk_total_bytes":100,"uptime_seconds":200})
        .to_string();
        let stamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs()
            .to_string();
        let mut mac = Hmac::<sha2::Sha256>::new_from_slice("a".repeat(32).as_bytes()).unwrap();
        mac.update(format!("{stamp}\nmain\n{body}").as_bytes());
        let signature = hex::encode(mac.finalize().into_bytes());
        let send = |signature: &str| {
            client
                .post(format!("{url}/api/pc/report"))
                .header("X-PC-ID", "main")
                .header("X-Timestamp", stamp.as_str())
                .header("X-Signature", signature)
                .body(body.clone())
        };
        assert_eq!(
            send("wrong").send().await.unwrap().status(),
            StatusCode::UNAUTHORIZED
        );
        assert_eq!(
            send(&signature).send().await.unwrap().status(),
            StatusCode::ACCEPTED
        );
        assert_eq!(
            send(&signature).send().await.unwrap().status(),
            StatusCode::UNAUTHORIZED
        );
        let stats: Value = client
            .get(format!("{url}/api/stats"))
            .send()
            .await
            .unwrap()
            .json()
            .await
            .unwrap();
        assert_eq!(stats["pc"]["online"], true);
        assert_eq!(stats["pc"]["stats"]["cpu_percent"], 25.0);
        let pc: Value = client
            .get(format!("{url}/api/stats/pc"))
            .send()
            .await
            .unwrap()
            .json()
            .await
            .unwrap();
        assert_eq!(pc["stats"]["memory_used_bytes"], 20);
    }

    #[tokio::test]
    async fn devjourney_preserves_github_contents_and_rejects_traversal() {
        let upstream = Router::new()
            .route(
                "/repos/owner/repo/contents",
                get(|| async {
                    Json(json!([{"name":"notes","path":"notes","type":"dir","sha":"abc"}]))
                }),
            )
            .route(
                "/repos/owner/repo/contents/{*path}",
                get(|uri: axum::http::Uri| async move {
                    Json(
                        json!({"name":"hello world.md","path":"notes/hello world.md",
                    "type":"file","encoding":"base64","content":"aGVsbG8=",
                    "requestPath":uri.path()}),
                    )
                }),
            );
        let base = serve(upstream).await;
        let client = reqwest::Client::new();
        let state = Arc::new(AppState {
            spotify: None,
            discord: None,
            pc: None,
            devjourney: Arc::new(devjourney::DevJourney::new(
                client.clone(),
                "owner".into(),
                "repo".into(),
                None,
                base,
            )),
            spotify_cache: Cache::new(Duration::from_secs(60)),
            discord_cache: Cache::new(Duration::from_secs(15)),
        });
        let url = serve(router(state, None)).await;
        let root: Value = client
            .get(format!("{url}/devjourney"))
            .send()
            .await
            .unwrap()
            .json()
            .await
            .unwrap();
        assert_eq!(root[0]["path"], "notes");
        let file: Value = client
            .get(format!("{url}/devjourney"))
            .query(&[("path", "notes/hello world.md")])
            .send()
            .await
            .unwrap()
            .json()
            .await
            .unwrap();
        assert_eq!(file["content"], "aGVsbG8=");
        assert!(
            file["requestPath"]
                .as_str()
                .unwrap()
                .contains("hello%20world")
        );
        let bad = client
            .get(format!("{url}/devjourney"))
            .query(&[("path", "../private")])
            .send()
            .await
            .unwrap();
        assert_eq!(bad.status(), StatusCode::BAD_REQUEST);
    }
}
