# upayan.dev

[![GitHub stars](https://img.shields.io/github/stars/upayanmazumder/upayan.dev?style=flat-square&logo=github)](https://github.com/upayanmazumder/upayan.dev/stargazers) [![Forks](https://img.shields.io/github/forks/upayanmazumder/upayan.dev?style=flat-square&logo=github)](https://github.com/upayanmazumder/upayan.dev/network) [![Issues](https://img.shields.io/github/issues/upayanmazumder/upayan.dev?style=flat-square&logo=github)](https://github.com/upayanmazumder/upayan.dev/issues)[![License: MIT](https://img.shields.io/github/license/upayanmazumder/upayan.dev?style=flat-square&color=green)](LICENSE)

[![Build & Push API](https://github.com/upayanmazumder/upayan.dev/actions/workflows/api.yml/badge.svg?branch=v5)](https://github.com/upayanmazumder/upayan.dev/actions/workflows/api.yml)

[Visit on DeepWiki](https://deepwiki.com/upayanmazumder/upayan.dev)

## What is this repo about?

This repository holds my personal website and the Rust API behind its live sections. The website is a dark, single-page portfolio with project case studies, certificates, and DevJourney. The API serves Spotify, Discord, Linux PC, and GitHub contribution data, and proxies DevJourney.

---

## Repository structure

- `api/`: Rust HTTP service, DevJourney proxy, and Linux PC client in `api/client/`.
- `app/`: Next.js website. Content lives in `app/src/data/*.ts`.

## Run the stats API

Read [the API setup guide](api/README.md). Configure Spotify, Discord, or signed PC reporting in `api/.env`.

```sh
cd api
cargo run
```

The health route is `http://127.0.0.1:8080/health`. The combined stats route is `http://127.0.0.1:8080/api/stats`.

## Run the website

```sh
cd app
pnpm install --frozen-lockfile
API_URL=http://127.0.0.1:8080 pnpm dev
```

The website runs at `http://127.0.0.1:3000`. `API_URL` is optional and read only on the server. Without it, the live, GitHub activity, and DevJourney sections show an unavailable state. Edit copy, projects, roles, and links in `app/src/data/`. The site deploys to Vercel. Set `API_URL` and `NEXT_PUBLIC_SITE_URL` there.

The home page keeps section text and links in server-rendered HTML. Interactive widgets load near the viewport. The GitHub calendar uses a canvas. Focus it and use arrow keys to inspect daily counts. The aurora waits for idle time before it starts WebGL.

The footer reads the latest published GitHub release tag from GitHub's public API.
It checks for a new tag each hour. If GitHub is unavailable, the footer reports
that the release is unavailable instead of showing the package version as a tag.

---

## Contributing

Feel free to open issues or submit pull requests if you find bugs or want to add new features.
Make sure to follow the existing code style and add tests/validation for new endpoints or clients.

---

## License

This project is licensed under the **MIT License** — see `LICENSE` for full details.
