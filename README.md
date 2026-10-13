# upayan.dev

[![GitHub stars](https://img.shields.io/github/stars/upayanmazumder/upayan.dev?style=flat-square&logo=github)](https://github.com/upayanmazumder/upayan.dev/stargazers) [![Forks](https://img.shields.io/github/forks/upayanmazumder/upayan.dev?style=flat-square&logo=github)](https://github.com/upayanmazumder/upayan.dev/network) [![Issues](https://img.shields.io/github/issues/upayanmazumder/upayan.dev?style=flat-square&logo=github)](https://github.com/upayanmazumder/upayan.dev/issues)[![License: MIT](https://img.shields.io/github/license/upayanmazumder/upayan.dev?style=flat-square&color=green)](LICENSE)

[![Build & Push API](https://github.com/upayanmazumder/upayan.dev/actions/workflows/api.yml/badge.svg?branch=v5)](https://github.com/upayanmazumder/upayan.dev/actions/workflows/api.yml)

[Visit on DeepWiki](https://deepwiki.com/upayanmazumder/upayan.dev)

## What is this repo about?

This checkout contains a standalone Rust API for Spotify, Discord, and Linux PC stats. It also preserves the master branch DevJourney proxy. The website frontend is not in this checkout.

---

## Repository structure

- `api/`: Rust HTTP service, DevJourney proxy, and Linux PC client in `api/client/`.

## Run the stats API

Read [the API setup guide](api/README.md). Configure Spotify, Discord, or signed PC reporting in `api/.env`.

```sh
cd api
cargo run
```

The health route is `http://127.0.0.1:8080/health`. The combined stats route is `http://127.0.0.1:8080/api/stats`.
---

## Contributing

Feel free to open issues or submit pull requests if you find bugs or want to add new features.
Make sure to follow the existing code style and add tests/validation for new endpoints or clients.

---

## License

This project is licensed under the **MIT License** — see `LICENSE` for full details.
