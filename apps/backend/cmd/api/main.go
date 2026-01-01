package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/upayanmazumder/upayan.dev/apps/backend/internal/config"
	"github.com/upayanmazumder/upayan.dev/apps/backend/internal/routes"
)

func main() {
	// Load configuration from environment variables
	if err := config.Load(); err != nil {
		log.Fatalf("❌ Failed to load configuration: %v", err)
	}

	log.Println("Configuration loaded successfully")

	r := routes.SetupRoutes()

	port := config.AppConfig.Port
	log.Printf("Backend running on :%s", port)
	log.Printf("Health check: http://localhost:%s/health", port)
	log.Printf("User activity: http://localhost:%s/api/activity", port)

	if err := http.ListenAndServe(fmt.Sprintf(":%s", port), r); err != nil {
		log.Fatal(err)
	}
}
