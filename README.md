# upayan.dev

[![GitHub stars](https://img.shields.io/github/stars/upayanmazumder/upayan.dev?style=flat-square&logo=github)](https://github.com/upayanmazumder/upayan.dev/stargazers) [![Forks](https://img.shields.io/github/forks/upayanmazumder/upayan.dev?style=flat-square&logo=github)](https://github.com/upayanmazumder/upayan.dev/network) [![Issues](https://img.shields.io/github/issues/upayanmazumder/upayan.dev?style=flat-square&logo=github)](https://github.com/upayanmazumder/upayan.dev/issues)[![License: MIT](https://img.shields.io/github/license/upayanmazumder/upayan.dev?style=flat-square&color=green)](LICENSE) [![Build & Push API](https://github.com/upayanmazumder/upayan.dev/actions/workflows/api.yml/badge.svg)](https://github.com/upayanmazumder/upayan.dev/actions/workflows/api.yml) [![Build & Push App](https://github.com/upayanmazumder/upayan.dev/actions/workflows/app.yml/badge.svg)](https://github.com/upayanmazumder/upayan.dev/actions/workflows/app.yml)

[Visit on DeepWiki](https://deepwiki.com/upayanamazumder/upayan.dev)

---

## What is this repo about?

This repository hosts the source code for my personal portfolio website. It includes:

- A fast, modern frontend with Next.js.
- A backend API (hosted on my personal VM) for device-status, telemetry, and integrations.
- Infrastructure for device‑clients (Windows, Android, Raspberry Pi) that report data.
- A VS Code extension to optionally push real‑time coding activity to the backend.

---

## Repository Structure

```

apps/
  app/         → Next.js frontend (portfolio site)
  api/         → Backend API services
  vscode/      → VS Code extension for live coding status

clients/
  win/         → Windows device‑agent (runs on both laptops)
  android/     → Android device‑agent (runs on both phones)
  pi/          → Raspberry Pi agent

packages/
  types/       → shared TS/Zod types
  utils/       → helper modules, API clients, config utilities

infra/
  docker/      → Dockerfiles, compose configs
  deploy/      → deployment and VM scripts

```

---

## Features

- Responsive, fast‑loading portfolio site (Next.js)
- Real-time device telemetry from multiple devices (laptops, phones, Pi)
- Unified API + clients architecture — easy to extend
- Secure per‑device authentication with tokens
- Modular monorepo setup — clean separation of concerns
- Supports future integrations: VS Code status, Spotify, device stats, etc.

---

## Local Setup (for development)

### Prerequisites

- Docker & Docker Compose
- Node.js (for local dev & building clients)

### Clone & Run

```bash
git clone https://github.com/upayanmazumder/upayan.dev.git
cd upayan.dev
docker-compose up --build
```

Once up:

- Frontend: `http://localhost:3000`
- Backend API: by default `http://localhost:8080`

### Development Without Docker

Inside `/apps/app` and `/apps/api`, you can run:

```bash
npm install
npm run dev
```

---

## Contributing

Feel free to open issues or submit pull requests if you find bugs or want to add new features.
Make sure to follow the existing code style and add tests/validation for new endpoints or clients.

---

## License

This project is licensed under the **MIT License** — see `LICENSE` for full details.
