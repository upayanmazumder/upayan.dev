use serde::{Deserialize, Serialize};

pub struct Discord {
    client: reqwest::Client,
    user_id: String,
    api_base: String,
}

impl Discord {
    pub fn new(client: reqwest::Client, user_id: String, api_base: String) -> Self {
        Self {
            client,
            user_id,
            api_base,
        }
    }

    pub async fn fetch(&self) -> Result<DiscordStats, String> {
        let url = format!(
            "{}/users/{}",
            self.api_base.trim_end_matches('/'),
            self.user_id
        );
        let response = self
            .client
            .get(url)
            .send()
            .await
            .map_err(|_| "Discord request failed".to_owned())?;
        if !response.status().is_success() {
            return Err("Discord returned an error".to_owned());
        }
        let envelope: Envelope = response
            .json()
            .await
            .map_err(|_| "Invalid Discord response".to_owned())?;
        if !envelope.success {
            return Err("Discord returned an error".to_owned());
        }
        envelope
            .data
            .ok_or_else(|| "Invalid Discord response".to_owned())
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct Envelope {
    success: bool,
    data: Option<DiscordStats>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiscordStats {
    pub discord_status: String,
    pub discord_user: DiscordUser,
    #[serde(default)]
    pub activities: Vec<DiscordActivity>,
    #[serde(default)]
    pub active_on_discord_mobile: bool,
    #[serde(default)]
    pub active_on_discord_desktop: bool,
    #[serde(default)]
    pub active_on_discord_web: bool,
    #[serde(default)]
    pub listening_to_spotify: bool,
    #[serde(default)]
    pub spotify: Option<DiscordSpotify>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiscordUser {
    pub id: String,
    pub username: String,
    #[serde(default)]
    pub display_name: Option<String>,
    #[serde(default)]
    pub global_name: Option<String>,
    #[serde(default)]
    pub avatar: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiscordActivity {
    #[serde(rename = "type")]
    pub activity_type: u8,
    pub name: String,
    #[serde(default)]
    pub details: Option<String>,
    #[serde(default)]
    pub state: Option<String>,
    #[serde(default)]
    pub emoji: Option<DiscordEmoji>,
    #[serde(default)]
    pub url: Option<String>,
    #[serde(default)]
    pub application_id: Option<String>,
    #[serde(default)]
    pub timestamps: Option<DiscordTimestamps>,
    #[serde(default)]
    pub assets: Option<DiscordAssets>,
    #[serde(default)]
    pub buttons: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiscordEmoji {
    #[serde(default)]
    pub name: Option<String>,
    #[serde(default)]
    pub id: Option<String>,
    #[serde(default)]
    pub animated: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiscordTimestamps {
    #[serde(default)]
    pub start: Option<i64>,
    #[serde(default)]
    pub end: Option<i64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiscordAssets {
    #[serde(default)]
    pub large_image: Option<String>,
    #[serde(default)]
    pub large_text: Option<String>,
    #[serde(default)]
    pub small_image: Option<String>,
    #[serde(default)]
    pub small_text: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DiscordSpotify {
    pub song: String,
    pub artist: String,
    pub album: String,
    pub album_art_url: String,
    pub track_id: String,
    pub timestamps: DiscordTimestamps,
}
