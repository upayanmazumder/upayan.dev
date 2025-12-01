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
