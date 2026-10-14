use serde::Serialize;
use serde_json::Value;
use std::{
    collections::BTreeMap,
    sync::Arc,
    time::{Duration, Instant},
};
use tokio::sync::Mutex;

pub struct Spotify {
    client: reqwest::Client,
    client_id: String,
    client_secret: String,
    refresh_token: String,
    api_base: String,
    token_url: String,
    token: Arc<Mutex<Option<CachedToken>>>,
}

struct CachedToken {
    value: String,
    expires_at: Instant,
}

#[derive(Serialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct SpotifyStats {
    pub playback: Option<Playback>,
    pub recent: Option<Vec<RecentTrack>>,
    pub top_artists: BTreeMap<String, Vec<Artist>>,
    pub top_tracks: BTreeMap<String, Vec<Track>>,
    pub errors: BTreeMap<String, String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Playback {
    pub is_playing: bool,
    pub item_type: Option<String>,
    pub timestamp: Option<i64>,
    pub progress: Option<u64>,
    pub track: Option<Track>,
    pub shuffle: Option<bool>,
    pub repeat: Option<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Track {
    pub title: Option<String>,
    pub artists: Vec<String>,
    pub album: Option<String>,
    pub art: Option<String>,
    pub url: Option<String>,
    pub duration: Option<u64>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentTrack {
    pub played_at: Option<String>,
    pub track: Track,
}

#[derive(Serialize)]
pub struct Artist {
    pub name: Option<String>,
    pub image: Option<String>,
    pub url: Option<String>,
}

impl Spotify {
    pub fn new(
        client: reqwest::Client,
        client_id: String,
        client_secret: String,
        refresh_token: String,
        api_base: String,
        token_url: String,
    ) -> Self {
        Self {
            client,
            client_id,
            client_secret,
            refresh_token,
            api_base,
            token_url,
            token: Arc::new(Mutex::new(None)),
        }
    }

    async fn access_token(&self) -> Result<String, String> {
        let mut cache = self.token.lock().await;
        if let Some(token) = cache.as_ref()
            && Instant::now() < token.expires_at
        {
            return Ok(token.value.clone());
        }
        let response = self
            .client
            .post(&self.token_url)
            .basic_auth(&self.client_id, Some(&self.client_secret))
            .form(&[
                ("grant_type", "refresh_token"),
                ("refresh_token", self.refresh_token.as_str()),
            ])
            .send()
            .await
            .map_err(|_| "Spotify token request failed".to_string())?;
        if !response.status().is_success() {
            return Err("Spotify token refresh failed".into());
        }
        let body: Value = response
            .json()
            .await
            .map_err(|_| "Spotify token response invalid".to_string())?;
        let value = body
            .get("access_token")
            .and_then(Value::as_str)
            .filter(|s| !s.is_empty())
            .ok_or("Spotify token response invalid")?
            .to_owned();
        let seconds = body
            .get("expires_in")
            .and_then(Value::as_u64)
            .filter(|s| *s > 0)
            .ok_or("Spotify token response invalid")?;
        let lifetime = seconds.saturating_sub(60).max(1);
        *cache = Some(CachedToken {
            value: value.clone(),
            expires_at: Instant::now() + Duration::from_secs(lifetime),
        });
        Ok(value)
    }

    async fn get(&self, token: &str, path: &str) -> Result<Option<Value>, String> {
        let url = format!("{}/{}", self.api_base.trim_end_matches('/'), path);
        let response = self
            .client
            .get(url)
            .bearer_auth(token)
            .send()
            .await
            .map_err(|_| "Spotify endpoint unavailable".to_string())?;
        if response.status() == reqwest::StatusCode::NO_CONTENT {
            return Ok(None);
        }
        if !response.status().is_success() {
            return Err("Spotify endpoint failed".into());
        }
        response
            .json()
            .await
            .map(Some)
            .map_err(|_| "Spotify endpoint response invalid".into())
    }

    pub async fn fetch(&self) -> Result<SpotifyStats, String> {
        let token = self.access_token().await?;
        let paths = [
            ("playback", "me/player"),
            ("current", "me/player/currently-playing"),
            ("recent", "me/player/recently-played?limit=10"),
            (
                "topArtistsShortTerm",
                "me/top/artists?time_range=short_term&limit=10",
            ),
            (
                "topTracksShortTerm",
                "me/top/tracks?time_range=short_term&limit=10",
            ),
            (
                "topArtistsMediumTerm",
                "me/top/artists?time_range=medium_term&limit=10",
            ),
            (
                "topTracksMediumTerm",
                "me/top/tracks?time_range=medium_term&limit=10",
            ),
            (
                "topArtistsLongTerm",
                "me/top/artists?time_range=long_term&limit=10",
            ),
            (
                "topTracksLongTerm",
                "me/top/tracks?time_range=long_term&limit=10",
            ),
        ];
        let results = tokio::join!(
            self.get(&token, paths[0].1),
            self.get(&token, paths[1].1),
            self.get(&token, paths[2].1),
            self.get(&token, paths[3].1),
            self.get(&token, paths[4].1),
            self.get(&token, paths[5].1),
            self.get(&token, paths[6].1),
            self.get(&token, paths[7].1),
            self.get(&token, paths[8].1),
        );
        let results = [
            results.0, results.1, results.2, results.3, results.4, results.5, results.6, results.7,
            results.8,
        ];
        let mut stats = SpotifyStats::default();
        let mut playback_state = None;
        let mut current = None;
        for ((key, _), result) in paths.iter().zip(results) {
            match result {
                Err(message) => {
                    stats.errors.insert((*key).into(), message);
                }
                Ok(None) => {}
                Ok(Some(value)) => match *key {
                    "playback" => playback_state = Some(value),
                    "current" => current = Some(value),
                    "recent" => {
                        stats.recent = Some(
                            items(&value)
                                .iter()
                                .filter_map(|entry| {
                                    entry.get("track").filter(|track| track.is_object()).map(
                                        |track| RecentTrack {
                                            played_at: string(entry, "played_at"),
                                            track: track_summary(track),
                                        },
                                    )
                                })
                                .collect(),
                        )
                    }
                    key if key.starts_with("topArtists") => {
                        stats.top_artists.insert(
                            range(key).into(),
                            items(&value)
                                .iter()
                                .map(|artist| Artist {
                                    name: string(artist, "name"),
                                    image: artist
                                        .get("images")
                                        .and_then(Value::as_array)
                                        .and_then(|images| images.first())
                                        .and_then(|image| string(image, "url")),
                                    url: spotify_url(artist),
                                })
                                .collect(),
                        );
                    }
                    key if key.starts_with("topTracks") => {
                        stats.top_tracks.insert(
                            range(key).into(),
                            items(&value).iter().map(track_summary).collect(),
                        );
                    }
                    _ => {}
                },
            }
        }
        if !stats.errors.contains_key("current") {
            let state = playback_state.as_ref();
            let playing = current.as_ref();
            stats.playback = Some(Playback {
                is_playing: playing
                    .and_then(|v| v.get("is_playing"))
                    .and_then(Value::as_bool)
                    .unwrap_or(false),
                item_type: playing.and_then(|v| string(v, "currently_playing_type")),
                timestamp: playing
                    .and_then(|v| v.get("timestamp"))
                    .and_then(Value::as_i64),
                progress: playing
                    .and_then(|v| v.get("progress_ms"))
                    .and_then(Value::as_u64),
                track: playing
                    .and_then(|v| v.get("item"))
                    .filter(|v| v.is_object())
                    .map(track_summary),
                shuffle: state
                    .and_then(|v| v.get("shuffle_state"))
                    .and_then(Value::as_bool),
                repeat: state.and_then(|v| string(v, "repeat_state")),
            });
        }
        if stats.errors.len() == paths.len() {
            return Err("Spotify endpoints unavailable".into());
        }
        Ok(stats)
    }
}

fn range(key: &str) -> &'static str {
    if key.ends_with("ShortTerm") {
        "short_term"
    } else if key.ends_with("MediumTerm") {
        "medium_term"
    } else {
        "long_term"
    }
}

fn items(value: &Value) -> &[Value] {
    value
        .get("items")
        .and_then(Value::as_array)
        .map(Vec::as_slice)
        .unwrap_or(&[])
}

fn string(value: &Value, key: &str) -> Option<String> {
    value.get(key).and_then(Value::as_str).map(str::to_owned)
}

fn spotify_url(value: &Value) -> Option<String> {
    value
        .get("external_urls")
        .and_then(|urls| string(urls, "spotify"))
}

fn track_summary(value: &Value) -> Track {
    Track {
        title: string(value, "name"),
        artists: value
            .get("artists")
            .and_then(Value::as_array)
            .map(|artists| {
                artists
                    .iter()
                    .filter_map(|artist| string(artist, "name"))
                    .collect()
            })
            .unwrap_or_default(),
        album: value.get("album").and_then(|album| string(album, "name")),
        art: value
            .get("album")
            .and_then(|album| album.get("images"))
            .and_then(Value::as_array)
            .and_then(|images| images.first())
            .and_then(|image| string(image, "url")),
        url: spotify_url(value),
        duration: value.get("duration_ms").and_then(Value::as_u64),
    }
}
