# User Activity API - Setup Guide

## Getting Started

### 1. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 2. Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy `Client ID` and `Client Secret`
4. Add `http://localhost:8080/callback` to Redirect URIs
5. Get your refresh token (see below)

#### Getting Spotify Refresh Token

Run this authorization flow to get your refresh token:

```bash
# Replace with your credentials
CLIENT_ID="your_client_id"
CLIENT_SECRET="your_client_secret"
REDIRECT_URI="http://localhost:8080/callback"

# Generate authorization URL
SCOPES="user-read-currently-playing user-read-playback-state"
AUTH_URL="https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}"

echo "Visit this URL: ${AUTH_URL}"
# After authorization, you'll get a CODE in the redirect URL

# Exchange code for tokens (replace CODE with the one from redirect)
CODE="your_authorization_code"
curl -X POST "https://accounts.spotify.com/api/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "${CLIENT_ID}:${CLIENT_SECRET}" \
  -d "grant_type=authorization_code&code=${CODE}&redirect_uri=${REDIRECT_URI}"

# Save the refresh_token from the response
```

### 3. Get Discord User ID

1. Enable Developer Mode in Discord (User Settings > Advanced > Developer Mode)
2. Right-click your profile and select "Copy User ID"
3. Paste this ID in your `.env` file

### 4. Update .env File

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
DISCORD_USER_ID=your_discord_user_id_here
PORT=8080
```

### 5. Run the API

```bash
go run cmd/api/main.go
```

## API Endpoints

- `GET /api/activity` - Combined Spotify & Discord activity
- `GET /api/activity/spotify` - Spotify playback only
- `GET /api/activity/discord` - Discord presence only

## Response Examples

### Combined Activity

```json
{
	"username": "upayan",
	"spotify": {
		"isPlaying": true,
		"trackName": "Song Name",
		"artist": "Artist Name",
		"album": "Album Name",
		"albumArt": "https://...",
		"trackUrl": "https://open.spotify.com/track/...",
		"progress": 45000,
		"duration": 180000
	},
	"discord": {
		"status": "online",
		"customStatus": "Building something cool",
		"activity": "Playing",
		"details": "Visual Studio Code",
		"state": "Editing activity.go",
		"application": "Visual Studio Code",
		"timestamp": 1701734400
	},
	"timestamp": 1701734400
}
```

## Notes

- The API uses Lanyard (https://api.lanyard.rest) for Discord presence
- Spotify tokens are automatically refreshed when expired
- Both services are called concurrently for optimal performance
- Errors are logged but don't break the entire response
