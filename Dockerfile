FROM node:23-alpine AS build-app
WORKDIR /app
COPY app/package.json ./package.json
RUN npm install
COPY app/ ./
RUN npm run build

FROM node:23-alpine AS build-api
WORKDIR /api
COPY api/package.json ./package.json
RUN npm install
COPY api/ ./

FROM node:23-alpine
WORKDIR /workspace

COPY --from=build-app /app ./app
COPY --from=build-api /api ./api

EXPOSE 3000
EXPOSE 4000

CMD ["sh", "-c", "cd app && npm run start & cd api && npm run build && npm run start"]