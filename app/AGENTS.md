# Next Frontend Plus Template — Agent Guide

> Coding-agent reference for this repo. Keep it current when adding tools, scripts, or conventions.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

## Project Overview

Next.js 16 (App Router) production-ready starter with:

- **Tailwind CSS v4** — utility-first styling, `@custom-variant dark` for class-based dark mode
- **Framer Motion** — animation primitives via `LazyMotion + domAnimation`
- **shadcn/ui** — component primitives via `@base-ui/react`
- **next-themes** — system/light/dark theme switching
- **TanStack Query v5** — async server state with SSR prefetch support
- **Axios** — HTTP client with typed error normalisation
- **Zustand v5** — client state with auto-selector helpers
- **t3-env + Zod v4** — build-time environment validation
- **React Hook Form + Zod v4** — type-safe forms via `useZodForm`
- **Sonner** — themed toast notifications
- **nuqs** — type-safe URL search params (requires `NuqsAdapter` in layout)
- **date-fns v4 + nanoid** — date formatting and ID generation
- **Vitest + Testing Library** — unit and component tests
- **ESLint + Prettier** — linting and formatting enforced in CI and pre-commit

---

## Directory Structure

```
src/
  env.ts                # t3-env schema — import here, never read process.env directly
  app/                  # Next.js App Router pages and layouts
    layout.tsx          # Root layout — providers live here
    page.tsx            # Home page
    motion/             # /motion demo route
  components/
    providers/          # Client-side React context providers
      query-provider.tsx
      theme-provider.tsx
      index.ts          # Barrel export
    motion/             # Framer Motion wrapper components
      index.ts
    ui/                 # shadcn-style primitive components
      button.tsx
      sonner.tsx        # Themed <Toaster>
  api/                  # HTTP layer
    client.ts           # axios instance `api` + createApiClient()
    errors.ts           # ApiError class, isApiError(), toApiError()
    request.ts          # request<S>() — typed, optionally schema-validated
    index.ts            # Barrel export
  lib/                  # Cross-cutting utilities (no side effects, tree-shakeable)
    utils.ts            # cn() — clsx + tailwind-merge
    motion.ts           # Shared animation variants and constants
    query.ts            # makeQueryClient(), getQueryClient(), createQueryKeys()
  hooks/                # Cross-cutting use* hooks (≥3 consumers or truly shared)
    use-mounted.ts
    use-zod-form.ts     # useZodForm(schema, options) — RHF + zodResolver
  stores/               # Zustand stores
    ui-store.ts         # useUiStore — which overlay (menu / palette) is open
    index.ts
  schemas/              # Shared Zod schemas
    common.ts           # emailSchema, paginationSchema, paginatedResponseSchema, …
    index.ts
  utils/                # Pure utility functions
    date.ts             # formatDate, formatDateTime, formatRelativeDate, timeAgo
    id.ts               # nanoid re-export
    index.ts
  constants/            # App-wide constants (no logic)
    api.ts              # API_TIMEOUT_MS, QUERY_STALE_TIME_MS, QUERY_GC_TIME_MS
    env.ts              # IS_PRODUCTION, IS_DEVELOPMENT, IS_TEST
    index.ts
  types/                # Cross-cutting TypeScript interfaces
    index.ts            # ApiResponse<T>, PaginatedResponse<T>, ApiErrorData
  test/
    setup.ts            # Vitest global setup (@testing-library/jest-dom)
```

Feature-specific hooks, types, and helpers should be colocated with their feature. Use `src/hooks/`, `src/types/`, and `src/schemas/` only for cross-cutting concerns used in three or more places.

---

## Commands

| Script              | What it does                 |
| ------------------- | ---------------------------- |
| `pnpm dev`          | Start dev server (Turbopack) |
| `pnpm build`        | Production build             |
| `pnpm start`        | Serve production build       |
| `pnpm lint`         | ESLint                       |
| `pnpm lint:fix`     | ESLint with auto-fix         |
| `pnpm format`       | Prettier write               |
| `pnpm format:check` | Prettier check (used in CI)  |
| `pnpm type-check`   | `tsc --noEmit`               |
| `pnpm test`         | Vitest run (single pass)     |
| `pnpm test:watch`   | Vitest in watch mode         |

---

## Conventions

### Modular Code

The single most important structural rule: **one concern per file**.

- A component renders. A hook manages state or side effects. A lib function transforms data. Never mix.
- If a component file exceeds ~150 lines, it is doing too much — extract.
- Logic that isn't directly tied to rendering belongs in a `use*` hook next to the component, or in `src/hooks/` if reused across three or more places.
- Shared pure functions go in `src/lib/`. Do not colocate data-transform logic inside components.
- New UI variants → add to the existing `cva()` call, not a new component.
- Prefer composing small components over branching inside a large one.

### Comments

- Comment **why**, not what. Code shows what; the comment explains the non-obvious decision behind it.
- No commented-out code — delete it, git has history.
- No multiline comments. Inline single-line comments only when the intent cannot be expressed in the code itself.

### TypeScript

- Use `interface` for object shapes and component props. Reserve `type` for unions and aliases.
- Always use `import type` for type-only imports. Enforced by ESLint (`consistent-type-imports`).
- `any` is banned. Use `unknown` and narrow.
- No explicit return types on components — let inference handle it. Explicit return types on exported `lib/` functions only.
- Use Zod v4 top-level APIs: `z.email()`, `z.url()`, `z.uuid()`. Avoid deprecated `ZodTypeAny` — use `ZodType`.

### Imports

Prettier auto-sorts on every format pass. The enforced order is:

```
react / react-dom
next and next/*

<third-party packages>

@/* (internal absolute)

./relative
```

Blank lines between each group are auto-inserted — do not add them by hand.

### Tailwind

- `prettier-plugin-tailwindcss` auto-sorts utility classes on format. Never sort by hand.
- Use `cn()` for conditional or merged class strings.
- Use `cva()` for components with variant axes.
- CSS variables for design tokens live in `src/app/globals.css` — do not inline raw colours.

### Components

- Named exports only — no default exports for components.
- Barrel `index.ts` in every component folder. Consumers import from the folder, not the file.
- Props via `interface Props extends …` — extend a base type where applicable.
- `'use client'` at the top only when the component genuinely needs interactivity. Default to Server Components.

### Environment Variables

- Never read `process.env` directly. Import from `@/env` to get type-safe, validated values.
- Set `SKIP_ENV_VALIDATION=true` in CI to bypass validation without supplying real secrets.

### HTTP / API

- Use `api` from `@/api` for all HTTP calls. Use `createApiClient(url)` for server-side internal URLs.
- Use `request({ ..., schema })` for zod-validated typed responses.
- All rejections from `api` are normalised to `ApiError`. Check with `isApiError(err)`.

### Data Fetching (TanStack Query)

- Define query keys with `createQueryKeys(entity)` from `@/lib/query`. Colocate the result with the feature's API module.
- Server-side prefetch: `getQueryClient()` → `prefetchQuery` → `<HydrationBoundary state={dehydrate(qc)}>`.
- Client components use `useQuery`, `useMutation`, `useSuspenseQuery` from `@tanstack/react-query`.
- The TanStack Query ESLint plugin (`@tanstack/eslint-plugin-query`) enforces exhaustive query keys.

### State Management (Zustand)

- One store per file in `src/stores/`. Use curried `create<State>()` form.
- Read state with an inline selector: `useStore(state => state.field)`. Do not use `store.use.field()` helpers. The React Compiler does not see them as hooks and can call them conditionally, which breaks hook order.
- For persisted stores, add `persist()` middleware.
- Server-side hydration: guard with `useMounted()` or call `store.persist.rehydrate()` as needed.

### Forms

- Use `useZodForm(schema, options?)` from `@/hooks/use-zod-form` — wires RHF + `zodResolver`.
- Colocate feature form schemas with the feature. Only cross-cutting primitives go in `src/schemas/`.
- Submit handler: validated data → `api`/`request` call → `toast.success/error`.

### Notifications (Sonner)

- Import `toast` from `sonner` and call directly. No wrapper needed.
- `<Toaster />` in `layout.tsx` handles positioning, theming, and stacking automatically.

### URL State (nuqs)

- Use `useQueryState` and `parseAs*` parsers from `nuqs` in client components.
- `NuqsAdapter` in `layout.tsx` is required — it is already wired.

### Adding a Provider

1. Create `src/components/providers/<name>.tsx` with `'use client'` at the top.
2. Export from `src/components/providers/index.ts`.
3. Compose it inside the hierarchy in `src/app/layout.tsx`.

---

## Theming

Dark mode is class-based (`@custom-variant dark (&:is(.dark *))`). `next-themes` stamps `.dark` on `<html>` before hydration — no flash.

- Default theme: `system` — follows `prefers-color-scheme` automatically.
- Use `useMounted()` from `src/hooks/use-mounted.ts` to guard any client-only rendering (e.g. reading `useTheme()` before hydration).

---

## Motion

`MotionProvider` wraps the app with `LazyMotion features={loadFeatures} strict` plus `MotionConfig reducedMotion="user"`. The features module (`components/motion/features.ts`) re-exports `domMax` and is loaded lazily, so the layout and gesture code stays out of the initial chunk. `strict` mode throws at runtime if any component renders `motion.*` elements. Use `m.*` (`m.div`, `m.span`, etc.) instead. Hooks like `useSpring`, `useMotionValue`, `useTransform`, `useInView`, and wrapper components like `AnimatePresence` and `LayoutGroup` are unaffected.

Shared variants and transition presets live in `src/lib/motion.ts`. Add new ones there, not inline.

Import brand icons through `src/components/ui/brand-paths.ts` (curated named imports from `simple-icons`). Never `import * as` from `simple-icons`.

### Activity gating

Loops, intervals, rAF callbacks, pointer listeners, and polling must stop when offscreen or the tab is hidden. Use the hooks in `src/hooks/use-active.ts`:

- `usePageVisible()` — true when `document.visibilityState` is `'visible'`.
- `useInViewport(ref, rootMargin?)` — true when the element is near the viewport (default 200 px margin).
- `useActive(ref, rootMargin?)` — both conditions combined.

For GSAP infinite tweens, pause and resume the tween or timeline rather than recreating it. `useNow(since, intervalMs, enabled)` in `components/home/_top/live/use-now.ts` already accepts an `enabled` flag driven by `useActive`.

SplitText loads through `@/lib/gsap-split` only when a text effect needs it. Keep `ScrollTrigger` in the shared GSAP module because the layout scroll controller uses it immediately. Below-the-fold widgets use `NearWidget` to retain server-rendered text and links until interaction code loads. Keep each fallback the same height as its interactive view.

## Testing

- Tests live next to their source in `__tests__/` subdirectories.
- Setup file: `src/test/setup.ts` — imports jest-dom matchers and registers `afterEach(cleanup)`.
- Import `describe`, `it`, `expect`, etc. explicitly from `vitest`.
- Use `@testing-library/react` for component tests; `@testing-library/user-event` for interactions.
- **What to test:** unit tests for all `lib/`, `api/`, `schemas/`, `utils/`, and `stores/` utilities; component tests for interactive components (state, events, ARIA). Skip pure layout/presentational components.
- Test behaviour, not implementation. Assert roles, labels, and states — not class strings or style values.
- Set `SKIP_ENV_VALIDATION=true` when running tests that transitively import `@/env` or `@/api/client`.

---

## Commit Messages

[Conventional Commits](https://www.conventionalcommits.org/) are enforced by the root `.husky/commit-msg` hook when `app/` files are staged.

```
<type>(<scope>): <description>

feat(auth): add OAuth provider
fix(button): correct disabled state focus ring
ci: add release workflow
```

Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.
Scope is optional, lowercase, single word.

---

## CI

The active workflows live at the repository root in `.github/workflows/`.

| File                 | Trigger                            | Checks                                             |
| -------------------- | ---------------------------------- | -------------------------------------------------- |
| `frontend-check.yml` | Every PR and app changes on `main` | Install, lint, format, type-check, test, and build |
| `api.yml`            | Every PR and API changes on `main` | Rust checks, then publish only on `main`           |

The root `.husky/pre-commit` hook formats staged frontend files. Other repository files do not use frontend hooks. CI uses `SKIP_ENV_VALIDATION=true` and does not install Husky hooks.

---

## Pull Requests

Use the root PR template (`.github/pull_request_template.md`). Every frontend PR must:

- Tick the correct type
- State what changed and why in 1–2 sentences
- Pass `pnpm lint && pnpm test` locally before opening
- Keep each file/component to a single concern
