# Stage 1: Build the frontend app
FROM node:23-alpine AS build-app
WORKDIR /app
COPY app/package.json app/package-lock.json* ./
RUN npm ci
COPY app/ .
RUN npm run build

# Stage 2: Build the backend API
FROM node:23-alpine AS build-api
WORKDIR /api
COPY api/package.json api/package-lock.json* ./
RUN npm ci
COPY api/ .
RUN npm run build

FROM node:23-alpine

RUN apk add --no-cache tini

WORKDIR /workspace

COPY --from=build-app /app ./app
COPY --from=build-api /api ./api

EXPOSE 3000 4000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["sh", "-c", "cd app && npm run start & cd api && npm run start"]
