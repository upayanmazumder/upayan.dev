use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};
use percent_encoding::{NON_ALPHANUMERIC, utf8_percent_encode};
use serde::Deserialize;
use serde_json::{Value, json};
use std::sync::Arc;

pub struct DevJourney {
    client: reqwest::Client,
    repo_url: String,
    token: Option<String>,
}

#[derive(Deserialize)]
pub struct PathQuery {
    path: Option<String>,
}

impl DevJourney {
    pub fn new(
        client: reqwest::Client,
        owner: String,
        repo: String,
        token: Option<String>,
        api_base: String,
    ) -> Self {
        Self {
            client,
            repo_url: format!(
                "{}/repos/{}/{}/contents",
                api_base.trim_end_matches('/'),
                owner,
                repo
            ),
            token,
        }
    }

    fn url(&self, path: Option<&str>) -> Result<String, &'static str> {
        let Some(path) = path.filter(|p| !p.is_empty()) else {
            return Ok(self.repo_url.clone());
        };
        if path.len() > 1024
            || path.starts_with('/')
            || path.ends_with('/')
            || path.contains('\\')
            || path.contains('\0')
        {
            return Err("invalid path");
        }
        let mut url = self.repo_url.clone();
        for segment in path.split('/') {
            if segment.is_empty() || segment == "." || segment == ".." {
                return Err("invalid path");
            }
            url.push('/');
            url.push_str(&utf8_percent_encode(segment, NON_ALPHANUMERIC).to_string());
        }
        Ok(url)
    }
}

pub async fn proxy(
    State(proxy): State<Arc<DevJourney>>,
    Query(query): Query<PathQuery>,
) -> (StatusCode, Json<Value>) {
    let url = match proxy.url(query.path.as_deref()) {
        Ok(url) => url,
        Err(error) => return (StatusCode::BAD_REQUEST, Json(json!({"error":error}))),
    };
    let mut request = proxy
        .client
        .get(url)
        .header(reqwest::header::ACCEPT, "application/vnd.github+json")
        .header(reqwest::header::USER_AGENT, "upayan.dev-devjourney-proxy")
        .header("X-GitHub-Api-Version", "2022-11-28");
    if let Some(token) = &proxy.token {
        request = request.bearer_auth(token);
    }
    let response = match request.send().await {
        Ok(response) => response,
        Err(_) => {
            return (
                StatusCode::BAD_GATEWAY,
                Json(json!({"error":"GitHub unavailable"})),
            );
        }
    };
    let status = response.status();
    if !status.is_success() {
        return (
            status,
            Json(json!({"error":"GitHub contents request failed","status":status.as_u16()})),
        );
    }
    let mut response = response;
    let mut bytes = Vec::new();
    loop {
        match response.chunk().await {
            Ok(Some(chunk)) if bytes.len().saturating_add(chunk.len()) <= 4 * 1024 * 1024 => {
                bytes.extend_from_slice(&chunk)
            }
            Ok(Some(_)) => {
                return (
                    StatusCode::BAD_GATEWAY,
                    Json(json!({"error":"GitHub contents too large"})),
                );
            }
            Ok(None) => break,
            Err(_) => {
                return (
                    StatusCode::BAD_GATEWAY,
                    Json(json!({"error":"GitHub response failed"})),
                );
            }
        }
    }
    match serde_json::from_slice(&bytes) {
        Ok(value) => (StatusCode::OK, Json(value)),
        Err(_) => (
            StatusCode::BAD_GATEWAY,
            Json(json!({"error":"Invalid GitHub response"})),
        ),
    }
}

pub fn valid_repo_part(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 100
        && value
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_' || b == b'.')
}
