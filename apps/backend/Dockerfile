# ========== Stage 1: Build ==========
# Use a Go toolchain that satisfies the project's go.mod (>= 1.25.4)
FROM golang:1.25.4 AS builder

WORKDIR /app

# Cache deps
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source
COPY . .

# Build the binary (static, no CGO headaches)
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./cmd/api

# ========== Stage 2: Run ==========
FROM alpine:latest

WORKDIR /app

# Copy binary from build stage
COPY --from=builder /app/server .

# Expose API port
EXPOSE 8080

# Run (no shell nonsense)
ENTRYPOINT ["./server"]
