package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/upayanmazumder/upayan.dev/apps/api/internal/services"
)

var (
	spotifyService *services.SpotifyService
	discordService *services.DiscordService
	once           sync.Once
)

func initServices() {
	once.Do(func() {
		spotifyService = services.NewSpotifyService()
		discordService = services.NewDiscordService()
	})
}

// UserActivityResponse represents the complete user activity
type UserActivityResponse struct {
	Username    string                    `json:"username"`
	Spotify     *services.SpotifyActivity `json:"spotify"`
	GuildStatus []*services.GuildStatus   `json:"guildStatus"`
	Timestamp   int64                     `json:"timestamp"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

// GetUserActivity returns the user's Spotify and Discord activity
func GetUserActivity(w http.ResponseWriter, r *http.Request) {
	initServices()
	w.Header().Set("Content-Type", "application/json")

	// Fetch both activities concurrently
	type result struct {
		spotify     *services.SpotifyActivity
		guildStatus []*services.GuildStatus
		errSpot     error
		errGuild    error
	}

	ch := make(chan result, 1)

	go func() {
		var res result
		var wg sync.WaitGroup
		wg.Add(2)

		go func() {
			defer wg.Done()
			res.spotify, res.errSpot = spotifyService.GetCurrentlyPlaying()
		}()

		go func() {
			defer wg.Done()
			res.guildStatus, res.errGuild = discordService.GetGuildStatuses()
		}()

		wg.Wait()
		ch <- res
	}()

	res := <-ch

	// Log errors but continue with partial data
	if res.errSpot != nil {
		log.Printf("Error fetching Spotify activity: %v", res.errSpot)
	}
	if res.errGuild != nil {
		log.Printf("Error fetching Discord guild statuses: %v", res.errGuild)
	}

	response := UserActivityResponse{
		Username:    "upayan",
		Spotify:     res.spotify,
		GuildStatus: res.guildStatus,
		Timestamp:   time.Now().Unix(),
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// GetSpotifyActivity returns only Spotify activity
func GetSpotifyActivity(w http.ResponseWriter, r *http.Request) {
	initServices()
	w.Header().Set("Content-Type", "application/json")

	spotify, err := spotifyService.GetCurrentlyPlaying()
	if err != nil {
		log.Printf("Error fetching Spotify activity: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(spotify)
}

// GetDiscordActivity returns only Discord activity
func GetDiscordActivity(w http.ResponseWriter, r *http.Request) {
	initServices()
	w.Header().Set("Content-Type", "application/json")

	guildStatus, err := discordService.GetGuildStatuses()
	if err != nil {
		log.Printf("Error fetching Discord guild statuses: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(guildStatus)
}
