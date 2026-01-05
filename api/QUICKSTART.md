# Quick Start

## 1. Setup Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials
```

## 2. Get Credentials

### Spotify

1. Create app at https://developer.spotify.com/dashboard
2. Get Client ID and Secret
3. Get refresh token (see README_ACTIVITY.md for full instructions)

### Discord

1. Enable Developer Mode in Discord settings
2. Right-click your profile → Copy User ID

## 3. Run

```bash
go run cmd/api/main.go
```

## 4. Test

```bash
# Combined activity
curl http://localhost:8080/api/activity

# Spotify only
curl http://localhost:8080/api/activity/spotify

# Discord only
curl http://localhost:8080/api/activity/discord
```

## Endpoints

- `GET /api/activity` - Both Spotify & Discord
- `GET /api/activity/spotify` - Spotify playback
- `GET /api/activity/discord` - Discord presence

## Architecture

- **Config**: `internal/config/config.go` - Loads .env variables
- **Services**:
  - `internal/services/spotify.go` - Spotify API with OAuth2
  - `internal/services/discord.go` - Lanyard API for Discord
- **Handlers**: `internal/handlers/activity.go` - REST endpoints

## Features

✅ Full Spotify OAuth2 integration with auto-refresh  
✅ Discord presence via Lanyard API  
✅ Concurrent API calls for performance  
✅ Proper error handling and logging  
✅ Environment-based configuration  
✅ Type-safe structs for all responses

See **README_ACTIVITY.md** for detailed setup instructions.
