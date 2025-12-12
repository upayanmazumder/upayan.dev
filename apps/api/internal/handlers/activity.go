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
	spotifyService  *services.SpotifyService
	discordService  *services.DiscordService
	wakatimeService *services.WakatimeService
	once            sync.Once
)

func initServices() {
	once.Do(func() {
		spotifyService = services.NewSpotifyService()
		discordService = services.NewDiscordService()
		wakatimeService = services.NewWakatimeService()
	})
}

// UserActivityResponse represents the complete user activity
type UserActivityResponse struct {
	Spotify     *services.SpotifyActivity  `json:"spotify"`
	GuildStatus []*services.GuildStatus    `json:"guildStatus"`
	Wakatime    *services.WakatimeActivity `json:"wakatime"`
	Timestamp   int64                      `json:"timestamp"`
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
		wakatime    *services.WakatimeActivity
		errSpot     error
		errGuild    error
		errWaka     error
	}

	ch := make(chan result, 1)

	go func() {
		var res result
		var wg sync.WaitGroup
		wg.Add(3)

		go func() {
			defer wg.Done()
			res.spotify, res.errSpot = spotifyService.GetCurrentlyPlaying()
		}()

		go func() {
			defer wg.Done()
			res.guildStatus, res.errGuild = discordService.GetGuildStatuses()
		}()

		go func() {
			defer wg.Done()
			res.wakatime, res.errWaka = wakatimeService.GetTodayStatus()
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
	if res.errWaka != nil {
		log.Printf("Error fetching Wakatime activity: %v", res.errWaka)
	}

	response := UserActivityResponse{
		Spotify:     res.spotify,
		GuildStatus: res.guildStatus,
		Wakatime:    res.wakatime,
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

// GetWakatimeActivity returns only Wakatime status
func GetWakatimeActivity(w http.ResponseWriter, r *http.Request) {
	initServices()
	w.Header().Set("Content-Type", "application/json")

	activity, err := wakatimeService.GetTodayStatus()
	if err != nil {
		log.Printf("Error fetching Wakatime activity: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(activity)
}
