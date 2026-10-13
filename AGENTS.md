# Repository Guidelines

## Project Overview

This repository contains a Rust stats API and a Next.js frontend starter. The frontend does not yet display API data. The API serves Spotify, Discord presence, signed Linux PC health reports, and a DevJourney GitHub contents proxy.

## Architecture & Data Flow

- `api/src/main.rs` validates environment settings, creates one shared `reqwest::Client`, constructs providers, and registers Axum routes.
- `GET /api/stats` fetches Spotify and Discord concurrently. Separate 60-second and 15-second caches store both successes and failures. The response keeps partial data and reports provider errors.
- `api/src/spotify.rs` refreshes an OAuth token and fetches playback, recent tracks, and top items. `api/src/discord.rs` reads Lanyard presence, not a Discord bot gateway.
- `api/client/src/main.rs` reads Linux CPU, memory, root disk, and uptime data. It signs one report and exits. `api/src/pc.rs` verifies HMAC-SHA256, rejects stale or repeated timestamps, and holds only the latest report in memory.
- `api/src/devjourney.rs` proxies a configured GitHub repository's contents. It returns the raw GitHub JSON shape used by the previous website.
- `app/src/app/` contains the Next.js starter pages. `app/src/api/` provides Axios and Zod request helpers. Providers, TanStack Query, and Zustand exist, but no page consumes the Rust API yet.

## Key Directories

- `api/src/`: HTTP routes, provider clients, and PC report validation.
- `api/client/`: Separate Linux reporter crate with its own `Cargo.lock`. It is not part of the API image or a Cargo workspace.
- `app/src/app/`: App Router pages and root layout.
- `app/src/api/`, `app/src/components/`, `app/src/lib/`, `app/src/stores/`: Frontend HTTP, UI, shared utilities, and client state.
- `.github/workflows/`: Path-scoped API and frontend checks and container builds. `.husky/` holds hooks for staged `app/` changes.

## Development Commands

Run Rust commands from the repository root, or enter the relevant crate directory.

```sh
cargo run --manifest-path api/Cargo.toml
cargo test --manifest-path api/Cargo.toml --locked
cargo fmt --manifest-path api/Cargo.toml --check
cargo clippy --manifest-path api/Cargo.toml --locked --all-targets -- -D warnings
cargo fmt --manifest-path api/client/Cargo.toml --check
cargo clippy --manifest-path api/client/Cargo.toml --locked --all-targets -- -D warnings
```

`GET http://127.0.0.1:8080/health` checks the process. `GET /api/stats` returns the combined stats. Run the Linux client from `api/client/` with `cargo build --release` and `./target/release/pc-report-client`.

Run frontend commands from `app/`:

```sh
pnpm install --frozen-lockfile
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080 pnpm dev
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080 pnpm build
```

## Code Conventions & Common Patterns

- Keep provider construction and shared state in `api/src/main.rs`. Inject HTTP clients and base URLs through constructors for local upstream tests.
- Use typed `serde` output fields to limit public data. Return fixed upstream error text instead of response bodies or credentials. Preserve the combined route's partial-result behavior.
- Keep the PC signing input byte-exact: `timestamp\nPC_ID\nJSON body`. Match the client and server when changing the report format.
- Follow `app/AGENTS.md` for detailed frontend rules. Use one concern per file, named component exports, colocated hooks and types, and `@/*` imports for `app/src/*`.
- Import validated frontend environment values from `@/env`. Use `src/api/` for HTTP requests and `src/lib/query.ts` for shared query settings. Keep client components limited to interactive UI.
- Let Prettier sort frontend imports and Tailwind classes. The root Husky hooks format staged `app/` files and check Conventional Commit messages for app changes.

## Important Files

- `api/src/main.rs`: service entry point, route contract, configuration, caches, and HTTP tests.
- `api/src/pc.rs` and `api/client/src/main.rs`: signed report contract and Linux metric collection.
- `api/src/devjourney.rs`: path validation and GitHub proxy contract.
- `api/.env.example` and `api/README.md`: server settings, OAuth scopes, route shapes, and PC timer setup.
- `app/src/env.ts`, `app/src/api/client.ts`, `app/src/app/layout.tsx`: frontend environment, HTTP client, and provider composition.
- `app/AGENTS.md`: detailed frontend conventions. `app/next.config.ts` enables standalone output for `app/Dockerfile`.

## Runtime/Tooling Preferences

- Use Rust 1.97 or later for both edition-2024 crates. Keep both Cargo lockfiles current. CI uses `cargo fmt`, tests, and Clippy with warnings denied.
- Use Node 22 and pnpm 11.28.5 for `app/`. There is no root `package.json`. Next.js is 16.2.11.
- Set `NEXT_PUBLIC_API_URL` to a URL for frontend builds. `SKIP_ENV_VALIDATION=true` is reserved for checks that do not need a real URL.
- Keep `api/.env`, Spotify credentials, `SIGNING_KEY`, and GitHub tokens out of commits and browser bundles. Use `api/.env.example` for key names. Set `CORS_ORIGIN` only for direct browser requests.
- Read `app/node_modules/next/dist/docs/` before changing Next.js behavior, as required by `app/AGENTS.md`.

## Testing & QA

- API tests are in `api/src/main.rs`. They use local Axum upstreams and real HTTP calls to check partial failures, private-field filtering, signatures, replay rejection, and proxy paths.
- Frontend tests use Vitest, jsdom, and Testing Library. Place tests beside source in `__tests__/`. Import Vitest helpers explicitly and assert user-visible behavior.
- `app/src/test/setup.ts` installs jest-dom matchers and cleanup. Reset singleton Zustand stores between tests. Use `SKIP_ENV_VALIDATION=true` when tests import `@/env` without a URL.
- No coverage threshold or end-to-end suite is configured. The PC client has no automated tests. Smoke changed routes and the actual one-shot client when behavior changes.
