package main

import (
	"log"
	"net/http"

	"github.com/upayanmazumder/upayan.dev/apps/api/internal/routes"
)

func main() {
	r := routes.SetupRoutes()

	log.Println("🚀 Backend running on :8080")
	log.Println("📝 Health check: http://localhost:8080/health")

	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}
