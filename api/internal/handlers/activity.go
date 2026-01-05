package handlers

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/upayanmazumder/upayan.dev/apps/backend/internal/config"
	"github.com/upayanmazumder/upayan.dev/apps/backend/internal/services"
)

var (
	spotifyService  *services.SpotifyService
	wakatimeService *services.WakatimeService
	once            sync.Once
)

func initServices() {
	once.Do(func() {
		spotifyService = services.NewSpotifyService()
		wakatimeService = services.NewWakatimeService()
	})
}

type SpotifySummary struct {
	IsPlaying bool   `json:"isPlaying"`
	TrackName string `json:"trackName,omitempty"`
	Artist    string `json:"artist,omitempty"`
	Album     string `json:"album,omitempty"`
	AlbumArt  string `json:"albumArt,omitempty"`
	TrackURL  string `json:"trackUrl,omitempty"`
	Progress  int    `json:"progress,omitempty"`
	Duration  int    `json:"duration,omitempty"`
	Timestamp int64  `json:"timestamp,omitempty"`
}

type WakatimeProjectSummary struct {
	Name    string  `json:"name"`
	Text    string  `json:"text"`
	Percent float64 `json:"percent,omitempty"`
}

type WakatimeLanguageSummary struct {
	Name    string  `json:"name"`
	Text    string  `json:"text"`
	Percent float64 `json:"percent,omitempty"`
}

type WakatimeSummary struct {
	HumanReadable string                    `json:"humanReadable,omitempty"`
	Digital       string                    `json:"digital,omitempty"`
	TotalSeconds  float64                   `json:"totalSeconds,omitempty"`
	TopProjects   []WakatimeProjectSummary  `json:"topProjects,omitempty"`
	TopLanguages  []WakatimeLanguageSummary `json:"topLanguages,omitempty"`
}

type UserActivityResponse struct {
	Spotify   *SpotifySummary  `json:"spotify"`
	Wakatime  *WakatimeSummary `json:"wakatime"`
	Timestamp int64            `json:"timestamp"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

// GetUserActivity returns the user's activity
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

	// Map full service responses to compact summaries
	var spotifySummary *SpotifySummary
	if res.spotify != nil {
		spotifySummary = &SpotifySummary{
			IsPlaying: res.spotify.IsPlaying,
			TrackName: res.spotify.TrackName,
			Artist:    res.spotify.Artist,
			Album:     res.spotify.Album,
			AlbumArt:  res.spotify.AlbumArt,
			TrackURL:  res.spotify.TrackURL,
			Progress:  res.spotify.Progress,
			Duration:  res.spotify.Duration,
			Timestamp: res.spotify.Timestamp,
		}
	}

	var wakaSummary *WakatimeSummary
	if res.wakatime != nil {
		// pick top 3 projects and languages for a concise view
		topProjects := make([]WakatimeProjectSummary, 0, 3)
		for i, p := range res.wakatime.Projects {
			if i >= 3 {
				break
			}
			topProjects = append(topProjects, WakatimeProjectSummary{Name: p.Name, Text: p.Text, Percent: p.Percent})
		}

		topLangs := make([]WakatimeLanguageSummary, 0, 3)
		for i, l := range res.wakatime.Languages {
			if i >= 3 {
				break
			}
			topLangs = append(topLangs, WakatimeLanguageSummary{Name: l.Name, Text: l.Text, Percent: l.Percent})
		}

		wakaSummary = &WakatimeSummary{
			HumanReadable: res.wakatime.HumanReadable,
			Digital:       res.wakatime.Digital,
			TotalSeconds:  res.wakatime.TotalSeconds,
			TopProjects:   topProjects,
			TopLanguages:  topLangs,
		}
	}

	response := UserActivityResponse{
		Spotify:   spotifySummary,
		Wakatime:  wakaSummary,
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

	summary := &SpotifySummary{
		IsPlaying: spotify.IsPlaying,
		TrackName: spotify.TrackName,
		Artist:    spotify.Artist,
		Album:     spotify.Album,
		AlbumArt:  spotify.AlbumArt,
		TrackURL:  spotify.TrackURL,
		Progress:  spotify.Progress,
		Duration:  spotify.Duration,
		Timestamp: spotify.Timestamp,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(summary)
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

	topProjects := make([]WakatimeProjectSummary, 0, 3)
	for i, p := range activity.Projects {
		if i >= 3 {
			break
		}
		topProjects = append(topProjects, WakatimeProjectSummary{Name: p.Name, Text: p.Text, Percent: p.Percent})
	}

	topLangs := make([]WakatimeLanguageSummary, 0, 3)
	for i, l := range activity.Languages {
		if i >= 3 {
			break
		}
		topLangs = append(topLangs, WakatimeLanguageSummary{Name: l.Name, Text: l.Text, Percent: l.Percent})
	}

	summary := &WakatimeSummary{
		HumanReadable: activity.HumanReadable,
		Digital:       activity.Digital,
		TotalSeconds:  activity.TotalSeconds,
		TopProjects:   topProjects,
		TopLanguages:  topLangs,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(summary)
}

// TelemetryPayload matches the telemetry emitted by the VS Code extension
type TelemetryPayload struct {
	WorkspaceName string                 `json:"workspaceName,omitempty"`
	Event         string                 `json:"event,omitempty"`
	File          string                 `json:"file,omitempty"`
	Durations     map[string]float64     `json:"durations,omitempty"`
	Timestamp     string                 `json:"timestamp,omitempty"`
	Extra         map[string]interface{} `json:"extra,omitempty"`
}

// ReceiveTelemetry accepts POST telemetry from clients (e.g., VS Code extension).
// If a signing key is configured, it validates the X-Signature HMAC-SHA256 header.
func ReceiveTelemetry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("failed to read telemetry body: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid body"})
		return
	}

	// validate signature if server has signing key
	if config.AppConfig != nil && config.AppConfig.SigningKey != "" {
		sig := r.Header.Get("X-Signature")
		if sig == "" {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "missing signature"})
			return
		}
		mac := hmac.New(sha256.New, []byte(config.AppConfig.SigningKey))
		mac.Write(bodyBytes)
		expected := hex.EncodeToString(mac.Sum(nil))
		if !hmac.Equal([]byte(expected), []byte(sig)) {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid signature"})
			return
		}
	}

	var payload TelemetryPayload
	if err := json.Unmarshal(bodyBytes, &payload); err != nil {
		log.Printf("invalid telemetry payload: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid payload"})
		return
	}

	// For now: log telemetry and acknowledge. You can extend to persist or forward.
	log.Printf("Telemetry received: workspace=%s event=%s file=%s", payload.WorkspaceName, payload.Event, payload.File)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
