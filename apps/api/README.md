# Go Backend API

A modular Go backend with hot reload for development.

## Quick Start

### First Time Setup

```powershell
make install
```

### Development (with hot reload)

```powershell
make dev
```

The server will start on `http://localhost:8080` and automatically reload when you make changes.

### Other Commands

**Build:**

```powershell
make build
```

**Run (without hot reload):**

```powershell
make run
```

**Clean build artifacts:**

```powershell
make clean
```

**Format code:**

```powershell
make fmt
```

**Run tests:**

```powershell
make test
```

## Project Structure

```
api/
├── cmd/api/           # Application entry point
│   └── main.go
├── internal/          # Private application code
│   ├── handlers/      # HTTP handlers
│   ├── middleware/    # HTTP middleware
│   └── routes/        # Route definitions
├── .air.toml          # Hot reload config
└── Makefile           # Build scripts
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/` - API root

## Technologies

- **chi** - Lightweight router
- **Air** - Hot reload for Go
