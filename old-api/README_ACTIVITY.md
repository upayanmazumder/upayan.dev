# Activity API - Complete Integration Guide

## 🚀 Full Spotify & Discord Integration

This API provides real-time user activity information from Spotify and Discord using proper OAuth2 and REST API integration.

## 📋 Features

- **Spotify Integration**: Real-time currently playing track with OAuth2 refresh token flow
- **Discord Integration**: Live presence via Lanyard API
- **Concurrent Fetching**: Both services called simultaneously for optimal performance
- **Auto Token Refresh**: Spotify access tokens automatically refreshed
- **Environment Variables**: Secure configuration using .env files
- **Error Handling**: Graceful degradation if one service fails

## 🔧 Setup Instructions

### Step 1: Install Dependencies

```bash
go mod download
```

### Step 2: Create .env File

Copy the example file:

```bash
cp .env.example .env
```

### Step 3: Configure Spotify

#### 3.1 Create Spotify App

1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click "Create App"
3. Fill in app details:
   - **App name**: Your choice
   - **App description**: Your choice
   - **Redirect URI**: `http://localhost:8080/callback`
4. Save and copy your **Client ID** and **Client Secret**

#### 3.2 Get Refresh Token

Replace the placeholders and run these commands:

**On Windows (PowerShell):**

```powershell
$CLIENT_ID="your_spotify_client_id"
$CLIENT_SECRET="your_spotify_client_secret"
$REDIRECT_URI="http://localhost:8080/callback"
$SCOPES="user-read-currently-playing user-read-playback-state"

$AUTH_URL="https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}"

Write-Host "Visit this URL and authorize:"
Write-Host $AUTH_URL

# After authorization, you'll be redirected to localhost:8080/callback?code=XXXXX
# Copy the code from the URL

$CODE="paste_code_here"
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${CLIENT_ID}:${CLIENT_SECRET}"))

Invoke-RestMethod -Uri "https://accounts.spotify.com/api/token" `
  -Method Post `
  -Headers @{Authorization="Basic $auth"} `
  -Body @{
    grant_type="authorization_code"
    code=$CODE
    redirect_uri=$REDIRECT_URI
  } | ConvertTo-Json
```

The response will contain a `refresh_token` - save this for your `.env` file.

### Step 4: Configure Discord

#### 4.1 Get Your Discord User ID

1. Open Discord
2. Go to User Settings → Advanced
3. Enable "Developer Mode"
4. Right-click your username/avatar
5. Select "Copy User ID"

#### 4.2 Join Lanyard (Optional but Recommended)

1. Join the Lanyard Discord: [https://discord.gg/lanyard](https://discord.gg/lanyard)
2. This enables real-time presence tracking

### Step 5: Update .env File

```env
# Spotify Configuration
SPOTIFY_CLIENT_ID=abc123xyz789
SPOTIFY_CLIENT_SECRET=def456uvw012
SPOTIFY_REFRESH_TOKEN=AQD...long_token_here...xyz

# Discord Configuration
DISCORD_USER_ID=123456789012345678

# Server Configuration
PORT=8080
```

### Step 6: Run the API

```bash
go run cmd/api/main.go
```

You should see:

```
✅ Configuration loaded successfully
🚀 Backend running on :8080
📝 Health check: http://localhost:8080/health
📊 User activity: http://localhost:8080/api/activity
```

## 📡 API Endpoints

### Get Combined Activity

```
GET /api/activity
```

Returns both Spotify and Discord activity.

**Example Response:**

```json
{
	"username": "upayan",
	"spotify": {
		"isPlaying": true,
		"trackName": "Bohemian Rhapsody",
		"artist": "Queen",
		"album": "A Night at the Opera",
		"albumArt": "https://i.scdn.co/image/...",
		"trackUrl": "https://open.spotify.com/track/...",
		"progress": 125000,
		"duration": 354000
	},
	"discord": {
		"status": "online",
		"customStatus": "Coding something cool",
		"activity": "Playing",
		"details": "Visual Studio Code",
		"state": "Editing Go files",
		"application": "Visual Studio Code",
		"timestamp": 1701734400
	},
	"timestamp": 1701734500
}
```

### Get Spotify Activity Only

```
GET /api/activity/spotify
```

**Example Response:**

```json
{
	"isPlaying": false
}
```

or when playing:

```json
{
	"isPlaying": true,
	"trackName": "Song Name",
	"artist": "Artist Name, Featured Artist",
	"album": "Album Name",
	"albumArt": "https://i.scdn.co/image/...",
	"trackUrl": "https://open.spotify.com/track/...",
	"progress": 45000,
	"duration": 180000
}
```

### Get Discord Activity Only

```
GET /api/activity/discord
```

**Example Response:**

```json
{
	"status": "dnd",
	"customStatus": "In a meeting",
	"activity": "Playing",
	"details": "Grand Theft Auto V",
	"state": "In Los Santos",
	"application": "Grand Theft Auto V",
	"timestamp": 1701734400
}
```

## 🏗️ Architecture

```
apps/api/
├── cmd/api/main.go              # Entry point, loads config
├── internal/
│   ├── config/config.go         # Environment variable loader
│   ├── handlers/
│   │   ├── activity.go          # Activity endpoints
│   │   └── health.go            # Health check
│   ├── middleware/
│   │   ├── cors.go              # CORS middleware
│   │   └── logger.go            # Request logger
│   ├── routes/routes.go         # Route definitions
│   └── services/
│       ├── spotify.go           # Spotify API client
│       └── discord.go           # Discord/Lanyard client
├── .env.example                 # Template for environment variables
├── .gitignore                   # Git ignore file (includes .env)
└── go.mod                       # Go dependencies
```

## 🔐 Security Notes

- **Never commit your `.env` file** - it's in `.gitignore`
- Store your refresh token securely
- Rotate tokens if compromised
- Use environment variables in production
- Consider rate limiting for public endpoints

## 🐛 Troubleshooting

### "Failed to load configuration" Error

- Check that your `.env` file exists
- Verify all required variables are set
- Ensure no extra spaces or quotes around values

### Spotify Returns 401 Unauthorized

- Your refresh token may have expired or been revoked
- Re-run the authorization flow to get a new refresh token
- Check that Client ID and Secret are correct

### Discord Returns Empty Data

- Verify your Discord User ID is correct
- Make sure you've joined the Lanyard Discord server
- Check that your Discord profile is not set to invisible

### "No content" from Spotify

- This is normal when nothing is playing
- `isPlaying` will be `false` in the response

## 📚 API Documentation

### Spotify Web API

- [Getting Started](https://developer.spotify.com/documentation/web-api)
- [Authorization Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
- [Currently Playing Endpoint](https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track)

### Lanyard API

- [Documentation](https://github.com/Pycord-Development/lanyard)
- [REST API Docs](https://github.com/Pycord-Development/lanyard/blob/main/README.md#rest-api)

## 🚀 Production Deployment

For production, consider:

1. **Use production-grade secrets management** (AWS Secrets Manager, HashiCorp Vault, etc.)
2. **Add caching** to reduce API calls (Redis recommended)
3. **Implement rate limiting** to prevent abuse
4. **Add monitoring** and logging (Prometheus, Grafana)
5. **Use HTTPS** with proper certificates
6. **Set up CORS** appropriately for your frontend domain

## 📝 License

See main repository LICENSE file.
