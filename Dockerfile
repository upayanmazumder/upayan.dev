# ---------- Stage 1: Install frontend dependencies ----------
FROM node:23-alpine AS deps-app
WORKDIR /app

# Install dependencies only (cached unless package.json changes)
COPY app/package.json app/package-lock.json* ./
RUN npm ci

# ---------- Stage 2: Build the frontend ----------
FROM deps-app AS build-app
# Now copy the source code and build
COPY app/ ./
RUN npm run build

# ---------- Stage 3: Install backend dependencies ----------
FROM node:23-alpine AS deps-api
WORKDIR /api

# Install backend dependencies only
COPY api/package.json api/package-lock.json* ./
RUN npm ci

# ---------- Stage 4: Build the backend ----------
FROM deps-api AS build-api
# Now copy backend source and build
COPY api/ ./
RUN npm run build

# ---------- Stage 5: Final runtime image ----------
FROM node:23-alpine AS runner

# Tini for better signal handling (e.g., Docker stop)
RUN apk add --no-cache tini

# Install PM2 globally
RUN npm install -g pm2

# Set working directory
WORKDIR /workspace

# Copy built frontend & backend from previous stages
COPY --from=build-app /app ./app
COPY --from=build-api /api ./api

# Copy PM2 ecosystem config
COPY ecosystem.config.js ./ecosystem.config.js

# Expose ports used by frontend (e.g., Next.js) and backend (Express?)
EXPOSE 3000 4000

# Use tini as the init system to handle PID 1
ENTRYPOINT ["/sbin/tini", "--"]

# Start both frontend and backend with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]