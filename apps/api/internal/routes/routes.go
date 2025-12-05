package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/upayanmazumder/upayan.dev/apps/api/internal/handlers"
	"github.com/upayanmazumder/upayan.dev/apps/api/internal/middleware"
)

func SetupRoutes() *chi.Mux {
	r := chi.NewRouter()

	// Global middleware
	r.Use(middleware.Logger)
	r.Use(middleware.CORS)

	// Health check
	r.Get("/health", handlers.HealthCheck)

	// API routes
	r.Route("/api", func(r chi.Router) {
		r.Get("/", func(w http.ResponseWriter, r *http.Request) {
			w.Write([]byte("API v1"))
		})

		// User activity endpoints
		r.Get("/activity", handlers.GetUserActivity)
		r.Get("/activity/spotify", handlers.GetSpotifyActivity)
		r.Get("/activity/discord", handlers.GetDiscordActivity)
	})

	return r
}
