## Android client

This folder contains a minimal Android Studio project under `android-app/` that provides:

- A basic UI (`MainActivity`) to set `apiHost` and `token` and start/stop reporting
- A foreground `MainService` that reports battery to the backend every 30s

Production API default: `https://api.upayan-v5.upayan.dev`

Build and run

1. Open `clients/android/android-app` in Android Studio.
2. Build and run on a device or emulator (minimum SDK 24).

Notes

- This is a lightweight skeleton to get you started. For production, add proper networking (Retrofit/OkHttp), background-use best practices, runtime permissions, and battery-friendly batching.

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
