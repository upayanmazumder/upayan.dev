package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	SpotifyClientID     string
	SpotifyClientSecret string
	SpotifyRefreshToken string
	DiscordUserID       string
	DiscordBotToken     string
	DiscordClientID     string
	DiscordClientSecret string
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
		DiscordUserID:       os.Getenv("DISCORD_USER_ID"),
		DiscordBotToken:     os.Getenv("DISCORD_BOT_TOKEN"),
		DiscordClientID:     os.Getenv("DISCORD_CLIENT_ID"),
		DiscordClientSecret: os.Getenv("DISCORD_CLIENT_SECRET"),
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
	if config.DiscordUserID == "" {
		return fmt.Errorf("DISCORD_USER_ID is required")
	}
	if config.DiscordBotToken == "" {
		return fmt.Errorf("DISCORD_BOT_TOKEN is required")
	}

	// Validate Discord User ID is numeric
	if _, err := strconv.ParseUint(config.DiscordUserID, 10, 64); err != nil {
		return fmt.Errorf("DISCORD_USER_ID must be a valid numeric Discord user ID")
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
