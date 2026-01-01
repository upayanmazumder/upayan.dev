# Stage 1 — deps install (cached efficiently)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
# Use --no-frozen-lockfile in CI builds to avoid failing when the lockfile
# is out-of-sync with package.json. For deterministic builds, regenerate
# and commit `pnpm-lock.yaml` so `--frozen-lockfile` can be re-enabled.
RUN corepack enable && pnpm install --no-frozen-lockfile

# Stage 2 — build the app
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

# Stage 3 — run optimized image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# copy built app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["pnpm", "start"]
