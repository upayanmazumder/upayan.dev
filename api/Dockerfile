# Stage 1 — dependencies
FROM node:22-alpine AS deps
WORKDIR /api
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && \
		if [ -f pnpm-lock.yaml ]; then \
			pnpm install --frozen-lockfile; \
		else \
			pnpm install --no-frozen-lockfile; \
		fi

# Stage 2 — builder (if using TypeScript)
FROM node:22-alpine AS builder
WORKDIR /api
COPY --from=deps /api/node_modules ./node_modules
COPY . .
RUN corepack enable && pnpm build

# Stage 3 — runtime
FROM node:22-alpine AS runner
WORKDIR /api

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /api/dist ./dist
COPY --from=builder /api/package.json ./package.json
COPY --from=builder /api/node_modules ./node_modules

EXPOSE 4000
CMD ["node", "dist/index.js"]
