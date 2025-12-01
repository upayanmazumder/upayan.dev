# Device Status Clients

This folder contains three device monitoring clients that report system info to the backend API endpoint:

```
POST https://<MY_API>/device/update
Authorization: Bearer <DEVICE_TOKEN>
Content-Type: application/json
```

Each client sends a payload structured as:

```json
{
  "deviceId": "<DEVICE_ID>",
  "status": { ... }
}
```

---

## 1. Windows Client (`win/`)

**Tech**: Node.js + TypeScript

**Collects**:

- CPU/RAM/GPU usage & temperatures
- Battery % and charging
- System uptime
- Top N processes (CPU sorted)
- WiFi SSID, local & public IP, ping latency to 8.8.8.8, VPN detection
- Active window title & application name

**Setup**:

```powershell
cd clients/win
npm install
```

Edit `clients/win/config.json`:

```json
{
	"deviceId": "your-device-id",
	"token": "your-bearer-token",
	"apiHost": "https://<MY_API>",
	"topNProcesses": 10,
	"intervalSeconds": 10
}
```

**Run**:

```powershell
npm run build
npm run start
```

**Background**: The client loops every 10 seconds (configurable) and retries on failures.

---

## 2. Raspberry Pi Client (`pi/`)

**Tech**: Python 3 + psutil

**Collects**:

- CPU usage & core temperatures
- RAM, disk usage
- Network IPs (local & public)
- Uptime, hostname

**Setup**:

```bash
sudo apt update && sudo apt install -y python3-pip
pip3 install psutil requests
```

Create or copy config to `/etc/pi-client/config.json`:

```json
{
	"deviceId": "pi-device-id",
	"token": "your-bearer-token",
	"apiHost": "https://<MY_API>",
	"intervalSeconds": 60
}
```

**Run (dev)**:

```bash
python3 clients/pi/client.py
```

**Systemd service** (production):

1. Copy `clients/pi/client.py` to `/usr/bin/pi-client-runner`
2. Copy `clients/pi/pi-client.service` to `/etc/systemd/system/`
3. Enable & start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable pi-client.service
sudo systemctl start pi-client.service
```

---

## 3. Android Client (`android/`)

**Tech**: Kotlin + Foreground Service + Retrofit

**Collects**:

- Battery % + charging
- WiFi + network type
- RAM usage
- Uptime
- Storage usage
- Device name & model

**Setup**:

This folder provides:

- `src/MainService.kt` — ForegroundService skeleton (TODO: integrate Retrofit & SharedPreferences)
- `build_snippet.md` — Gradle dependencies and manifest snippet

Integrate into a full Android Studio project. Store `deviceId` and `token` in `SharedPreferences`.

**Behavior**: Reports every 30–60s in background using WorkManager or ForegroundService.

---

## General Rules

- **Never hardcode secrets** — all clients read from external config files.
- **Retry logic** — all clients continue on errors (exponential backoff).
- **Modular code** — each client separates config, system, network, and API client logic.

For more details, see the READMEs in each client folder.
