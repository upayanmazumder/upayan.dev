package config

import (
	"encoding/json"
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
	// DeviceKeys maps a logical device name to its API key/token
	DeviceKeys map[string]string
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

	// Load device keys from DEVICES_JSON environment variable if provided
	devicesJSON := os.Getenv("DEVICES_JSON")
	if devicesJSON != "" {
		m := make(map[string]string)
		if err := json.Unmarshal([]byte(devicesJSON), &m); err != nil {
			return fmt.Errorf("failed to parse DEVICES_JSON: %w", err)
		}
		config.DeviceKeys = m
	} else {
		config.DeviceKeys = make(map[string]string)
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
