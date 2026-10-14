FROM rust:1.97-slim AS build
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --release --locked

FROM debian:trixie-slim
RUN useradd --system --create-home --uid 10001 stats
COPY --from=build /app/target/release/upayan-stats-api /usr/local/bin/upayan-stats-api
USER stats
ENV BIND_HOST=0.0.0.0 PORT=8080
EXPOSE 8080
CMD ["upayan-stats-api"]
