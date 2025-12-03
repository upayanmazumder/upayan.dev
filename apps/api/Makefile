.PHONY: dev build run clean install

# Install Air for hot reload
install:
	@echo "Installing Air..."
	@go install github.com/air-verse/air@latest

# Run with hot reload (development)
dev:
	@echo "Starting with hot reload..."
	@air

# Build the binary
build:
	@echo "Building..."
	@go build -o server.exe ./cmd/api

# Run without hot reload
run: build
	@echo "Starting server..."
	@./server.exe

# Clean build artifacts
clean:
	@echo "Cleaning..."
	@if exist tmp rmdir /s /q tmp
	@if exist server.exe del server.exe
	@echo "Done!"

# Run tests
test:
	@go test -v ./...

# Format code
fmt:
	@go fmt ./...

# Tidy dependencies
tidy:
	@go mod tidy
