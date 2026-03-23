# upayan.dev

![GitHub stars](https://img.shields.io/github/stars/upayanmazumder/upayan.dev?style=social)
![GitHub forks](https://img.shields.io/github/forks/upayanmazumder/upayan.dev?style=social)
![License](https://img.shields.io/badge/license-MIT-green)

Monorepo for my personal website and API. This repository contains a Next.js frontend (`app/`) and a TypeScript + Express API (`api/`). The project is containerized for production (multi-stage Dockerfile + PM2) and supports a convenient local development workflow using `concurrently`.

## Table of contents

- [Repository layout](#repository-layout)
- [Tech stack](#tech-stack)
- [Quick start (development)](#quick-start-development)
- [Build & production](#build--production)
- [Docker](#docker)
- [Environment variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Repository layout

- `app/` – Next.js 16 frontend (React 19). See `app/package.json` for scripts.
- `api/` – TypeScript + Express backend (src in `api/src`). See `api/package.json` for scripts.
- `Dockerfile` – multi-stage build producing a runtime image that runs both services via PM2.
- `docker-compose.yml` – simple compose file used for local/container runs (image: `ghcr.io/upayanmazumder/upayan.dev:latest`).
- `ecosystem.config.js` – PM2 configuration used by the container runtime.
- `example.env` – example environment variables.

## Tech stack

- Frontend: Next.js 16, React 19
- Backend: Node.js, TypeScript, Express
- Runtime: PM2 (production image), locally uses `concurrently` to run both services in dev
- Containerization: Docker, Docker Compose

## Quick start (development)

Prerequisites:

- Node.js (recommend 18+; Dockerfile uses `node:23-alpine`)
- npm or a compatible package manager

1. Clone the repository:

```bash
git clone https://github.com/upayanmazumder/upayan.dev.git
cd upayan.dev
```

2. Install dependencies:

```bash
# install root dev tools
npm install

# install frontend and backend dependencies
cd app && npm install
cd ../api && npm install
cd ..
```

3. Start development servers (from repo root):

```bash
npm run dev
```

This runs both the frontend and backend concurrently. By default:

- Frontend (Next dev): http://localhost:3000
- Backend (ts-node dev server): http://localhost:4000

You can also run each service individually:

```bash
cd app && npm run dev
# in another terminal
cd api && npm run dev
```

## Build & production

- Build frontend (Next):

```bash
npm run build    # runs `cd app && next build`
```

- Build backend (TypeScript -> JS):

```bash
cd api && npm run build
```

The repository's `Dockerfile` performs both these steps in a multi-stage build and then starts both services with PM2 in the runtime image.

## Docker

Quick start with Docker Compose (recommended for production-like testing):

```bash
docker-compose up --build
```

The compose file references the image `ghcr.io/upayanmazumder/upayan.dev:latest`. You can also build and run locally:

```bash
docker build -t upayan.dev .
docker run -p 3000:3000 -p 4000:4000 --env-file .env upayan.dev
```

The container uses `ecosystem.config.js` and `pm2-runtime` to start both the frontend and backend.

## Environment variables

Copy `example.env` to `.env` and fill in the required values:

```bash
cp example.env .env
# edit .env
```

Key variables found in `example.env`:

- `BOT_TOKEN` – (optional) bot token used by integrations
- `CONTACT_WEBHOOK_URL` – (optional) contact webhook URL
- `GITHUB_TOKEN` – (optional) GitHub token for API calls
- `NEXT_PUBLIC_ENV` – `development`, `staging` or `production`

Only provide the secrets you need for local testing or production.

## Contributing

Contributions are welcome. Recommended workflow:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make changes and run the relevant dev server(s) locally.
4. Lint or format if necessary (`cd app && npm run lint`).
5. Push your branch and open a PR.

Please follow the `CODE_OF_CONDUCT.md` and `SECURITY.md` in the repo.

## License

This project is licensed under the MIT License — see the [LICENSE](https://github.com/upayanmazumder/upayan.dev/blob/master/LICENSE) file for details.
