# -------------------------------------
# Stage 1: Base build image for caching
# -------------------------------------
FROM node:23-alpine AS base
WORKDIR /workspace
ENV NODE_ENV=production
RUN apk add --no-cache tini

# -------------------------------------
# Stage 2: Build frontend (Next.js)
# -------------------------------------
FROM base AS build-app

WORKDIR /workspace/app

# Install dependencies first to cache better
COPY app/package.json app/package-lock.json* ./
RUN npm ci

# Then copy the rest of the frontend source
COPY app/ ./

# Build Next.js app
RUN npm run build

# -------------------------------------
# Stage 3: Build backend (TypeScript Express API)
# -------------------------------------
FROM base AS build-api

WORKDIR /workspace/api

# Install dependencies first to cache better
COPY api/package.json api/package-lock.json* ./
RUN npm ci

# Then copy the rest of the backend source
COPY api/ ./

# Build API (tsc -> dist/)
RUN npm run build

# -------------------------------------
# Stage 4: Runtime (smallest, cleanest)
# -------------------------------------
FROM node:23-alpine AS runtime

WORKDIR /workspace

RUN apk add --no-cache tini

ENV NODE_ENV=production

COPY --from=build-app /workspace/app/.next/ ./app/.next/
COPY --from=build-app /workspace/app/public/ ./app/public/
COPY --from=build-app /workspace/app/package.json ./app/package.json
COPY --from=build-app /workspace/app/node_modules/ ./app/node_modules/

COPY --from=build-api /workspace/api/dist/ ./api/dist/
COPY --from=build-api /workspace/api/package.json ./api/package.json
COPY --from=build-api /workspace/api/node_modules/ ./api/node_modules/

EXPOSE 3000 4000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "-e", "\
    require('child_process').spawn('npm', ['start'], { cwd: './app', stdio: 'inherit' }); \
    require('child_process').spawn('npm', ['start'], { cwd: './api', stdio: 'inherit' }); \
    "]
