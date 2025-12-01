# Android client (Kotlin) — skeleton

This folder contains a lightweight skeleton and guidance for implementing the Android foreground service client.

Requirements & guidance

- Use a Foreground Service or WorkManager to report every 30–60s.
- Store `deviceId` and `token` in `SharedPreferences`.
- Use Retrofit or Ktor client for network calls.
- POST to `https://<MY_API>/device/update` with `Authorization: Bearer <DEVICE_TOKEN>`.

Files

- `src/MainService.kt` — ForegroundService skeleton demonstrating Retrofit call.
- `build_snippet.md` — Gradle dependencies and manifest snippet.
