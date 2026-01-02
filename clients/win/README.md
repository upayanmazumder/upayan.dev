## Windows client

Install and run as a service (optional):

1. Build

```bash
pnpm install
pnpm run build
```

2. (Optional) Install as Windows service

```powershell
pnpm add node-windows --workspace=false
node ./scripts/install-service.js
```

3. Configure `config.json` (set `deviceId` and `token`)

By default `apiHost` points to production: `https://api.upayan-v5.upayan.dev`.

# Windows device-status client (TypeScript)

Overview

- Node.js + TypeScript client that collects system/network/activity info and POSTs to `/device/update`.

Config

- `clients/win/config.json` - fill `deviceId` and `token` and set `apiHost`.

Install & run

1. In PowerShell (from repository root):

```powershell
cd clients/win
npm install
npm run build
npm run start
```

Notes

- Do not commit secrets. `config.json` is intentionally empty for `deviceId` and `token`.
- Uses `systeminformation`, `active-win`, and `node-fetch`.
