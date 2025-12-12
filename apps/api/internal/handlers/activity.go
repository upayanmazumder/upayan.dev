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
	Spotify   *services.SpotifyActivity  `json:"spotify"`
	Wakatime  *services.WakatimeActivity `json:"wakatime"`
	Timestamp int64                      `json:"timestamp"`
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
		spotify  *services.SpotifyActivity
		wakatime *services.WakatimeActivity
		errSpot  error
		errWaka  error
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
	if res.errWaka != nil {
		log.Printf("Error fetching Wakatime activity: %v", res.errWaka)
	}

	response := UserActivityResponse{
		Spotify:   res.spotify,
		Wakatime:  res.wakatime,
		Timestamp: time.Now().Unix(),
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
