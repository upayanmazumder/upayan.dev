package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	SpotifyClientID     string
	SpotifyClientSecret string
	SpotifyRefreshToken string
	WakatimeAPIKey      string
	Port                string
}

var AppConfig *Config

// Load reads environment variables and initializes the application config
func Load() error {
	// Load .env file if it exists (ignore error if file doesn't exist)
	_ = godotenv.Load()

	config := &Config{
		SpotifyClientID:     os.Getenv("SPOTIFY_CLIENT_ID"),
		SpotifyClientSecret: os.Getenv("SPOTIFY_CLIENT_SECRET"),
		SpotifyRefreshToken: os.Getenv("SPOTIFY_REFRESH_TOKEN"),
		WakatimeAPIKey:      os.Getenv("WAKATIME_API_KEY"),
		Port:                getEnvOrDefault("PORT", "8080"),
	}

	// Validate required fields
	if config.SpotifyClientID == "" {
		return fmt.Errorf("SPOTIFY_CLIENT_ID is required")
	}
	if config.SpotifyClientSecret == "" {
		return fmt.Errorf("SPOTIFY_CLIENT_SECRET is required")
	}
	if config.SpotifyRefreshToken == "" {
		return fmt.Errorf("SPOTIFY_REFRESH_TOKEN is required")
	}

	if config.WakatimeAPIKey == "" {
		return fmt.Errorf("WAKATIME_API_KEY is required")
	}

	AppConfig = config
	return nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
