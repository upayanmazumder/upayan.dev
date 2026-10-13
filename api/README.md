# Website stats API

This standalone Rust service reads Spotify Web API data and Discord presence through Lanyard. It also accepts signed Linux PC health reports and proxies DevJourney GitHub contents.

## Plan and scope

1. Serve Spotify playback and Discord presence with isolated provider clients.
2. Serve current Spotify playback, recent tracks, and top artists and tracks for three time ranges. Serve Discord status, public user details, active clients, activities, and linked Spotify presence.
3. Keep credentials on the server. Limit public output to display fields. Cache Spotify for 60 seconds and Discord for 15 seconds.
4. Return each provider independently. Do not hide failed provider requests as an offline or empty state.
5. Accept only the selected PC health metrics through signed reports. Run the Linux client from a timer, not a resident daemon.
6. Preserve the master branch `/devjourney?path=...` contract for the website.

Spotify does not provide a lifetime play count through these endpoints. Top items are affinity rankings, not play counts. Recent tracks exclude podcast episodes. Lanyard provides current presence, not a historical Discord activity total. The API does not expose private Spotify profile fields, device names, Discord session IDs, or Lanyard KV values.

## Setup

Install Rust 1.97 or later. Copy `.env.example` to `.env` inside `api/`. Configure Spotify, Discord, or PC reporting. Start the service from `api/`:

```sh
cargo run
```

Check `http://127.0.0.1:8080/health` and `http://127.0.0.1:8080/api/stats`. Keep `.env` private. Bind to loopback by default. Use a TLS reverse proxy for public access. Set `BIND_HOST=0.0.0.0` only when the deployment needs it. Set `CORS_ORIGIN` to the exact website origin for direct browser requests. Server-side website requests do not need CORS.

### Spotify credentials

Create an app in the [Spotify dashboard](https://developer.spotify.com/dashboard). Authorize your own account with the [authorization code flow](https://developer.spotify.com/documentation/web-api/tutorials/code-flow). Request `user-read-currently-playing user-read-playback-state user-read-recently-played user-top-read` scopes. Exchange the authorization code for a refresh token. Set `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and `SPOTIFY_REFRESH_TOKEN`. Keep the token and secret server-side. Spotify can limit access to approved users in development mode. Reauthorize when scopes change.

### Discord presence

Set `DISCORD_USER_ID` to your Discord user ID. Join the [Lanyard server](https://github.com/Phineas/lanyard#readme) with that account. Lanyard must monitor the account. Invisible presence can appear offline. Spotify data in Discord depends on account linking and presence settings. The Spotify Web API and Lanyard Spotify views can differ. The existing bot credentials in `.env` are not required by this service.

### PC health reporter

The Linux client reads CPU load from `/proc/stat`, memory from `/proc/meminfo`, uptime from `/proc/uptime`, and root disk use from `statvfs`. It does not report file names, process names, active windows, or network addresses. A report is one HTTP request. The client exits after each request.

Set `SIGNING_KEY` on the server and client to the same random value of at least 32 bytes. The existing `SIGNING_KEY` in your `api/.env` can serve this purpose. Set `PC_ID` on both sides, or use the default `main`. The client takes `API_URL` as the server base URL. It defaults to `http://127.0.0.1:8080`. Use HTTPS for remote reports. Do not publish the signing key or send it in a request body.

From `api/client/`, build the client. Supply the same environment values as the server before you run one report:

```sh
cargo build --release
./target/release/pc-report-client
```

For periodic reports on the PC, install the binary at `~/.local/bin/pc-report-client`. Save `API_URL`, `PC_ID`, and `SIGNING_KEY` in `~/.config/upayan-pc.env` with mode 0600. Create these user units:

```ini
# ~/.config/systemd/user/upayan-pc.service
[Unit]
Description=Send PC health to upayan.dev
[Service]
Type=oneshot
EnvironmentFile=%h/.config/upayan-pc.env
ExecStart=%h/.local/bin/pc-report-client
```

```ini
# ~/.config/systemd/user/upayan-pc.timer
[Unit]
Description=Send PC health every minute
[Timer]
OnBootSec=1min
OnUnitActiveSec=1min
Unit=upayan-pc.service
[Install]
WantedBy=timers.target
```

Run `systemctl --user daemon-reload`, then `systemctl --user enable --now upayan-pc.timer`. The service stores only the latest report in memory. A restart clears it. `online` becomes false after 180 seconds without a report. Signatures cover the timestamp, PC ID, and exact JSON body. The server rejects stale or repeated timestamps within the current process lifetime. Synchronize the PC clock. Do not expose port 8080 without a TLS proxy.

### DevJourney proxy

`GET /devjourney` and `GET /devjourney?path=folder%2Ffile.md` preserve the master branch response shape. The API returns the GitHub contents object or directory array without an envelope. Set `DEVJOURNEY_REPO_OWNER` and `DEVJOURNEY_REPO_NAME` only if the defaults differ. A dedicated `DEVJOURNEY_GITHUB_TOKEN` can increase the rate limit. Do not configure a token that can read private repository content. The public proxy makes every allowed file in that repository accessible to visitors. The proxy rejects traversal and returns fixed error text without upstream response bodies.

## Routes

| Route | Response |
| --- | --- |
| `GET /health` | `{ "status": "ok" }`. Process health, not provider availability. |
| `GET /api/stats` | `{ "spotify": ..., "discord": ..., "pc": ..., "errors": { "spotify": null, "discord": null }, "timestamp": 0 }`. Timestamp uses Unix seconds. |
| `GET /api/stats/spotify` | `{ "data": ..., "error": null }` on success. |
| `GET /api/stats/discord` | `{ "data": ..., "error": null }` on success. |
| `GET /api/stats/pc` | `{ "online": false, "lastSeen": null, "stats": null }` before the first report. |
| `POST /api/pc/report` | Requires `X-PC-ID`, `X-Timestamp`, and `X-Signature`. Returns 202 after a valid report. |
| `GET /devjourney?path=...` | Raw GitHub contents JSON for the configured repository. |

Unavailable providers return `null` data with an error. An individual provider route returns 502 for an upstream failure or 503 for missing configuration. The combined route returns 502 when no configured provider succeeds and PC reporting is disabled. A partial result returns 200 with the failed provider in `errors`. Spotify also reports per-endpoint errors within its data when some Spotify requests fail. These errors use fixed messages. They never contain provider response bodies or credentials.

Playback can be absent while rankings and recent tracks remain available. Time ranges are `short_term` (about four weeks), `medium_term` (about six months), and `long_term` (about one year). The service requests at most ten entries per list. External API access requires outbound HTTPS.

## Website use

Fetch the combined route from the website server or browser. Set the public API URL in the website deployment. Render `spotify`, `discord`, and `pc` separately. Read `errors` before showing an offline or empty state. Use the provider routes if each card refreshes at a different rate. Never send Spotify credentials or the signing key to the website client. The frontend from master is not in this checkout. Its DevJourney component requests `/devjourney?path=...`, which this API preserves.

## Deploy and check

```sh
cargo test
cargo run
# In another terminal:
curl -i http://127.0.0.1:8080/health
curl -i http://127.0.0.1:8080/api/stats
```

Build the included Dockerfile from `api/` with `docker build -t upayan-stats-api .`. Supply environment variables at runtime. Do not copy `.env` into the image. The container listens on port 8080.

## Provider access problems

If Spotify token refresh returns HTTP 400, check the client ID, client secret, and refresh token as one credential set. Reauthorize the account with all four scopes after a credential or scope change. A configured token alone does not prove that Spotify will accept it.

If Lanyard returns HTTP 404 for the Discord user ID, check the ID and join the Lanyard server with that account. A bot token does not register a user with Lanyard. This service uses Lanyard for presence. It does not connect a Discord bot to the gateway.

Sources: [Spotify currently playing](https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track), [recent tracks](https://developer.spotify.com/documentation/web-api/reference/get-recently-played), [top items](https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks), [Lanyard REST](https://github.com/Phineas/lanyard#api-docs).
