package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/upayanmazumder/upayan.dev/apps/api/internal/config"
)

type DiscordService struct {
	client *http.Client
}

type lanyardResponse struct {
	Success bool `json:"success"`
	Data    struct {
		DiscordUser struct {
			ID       string `json:"id"`
			Username string `json:"username"`
		} `json:"discord_user"`
		DiscordStatus string `json:"discord_status"`
		Activities    []struct {
			Name          string `json:"name"`
			Type          int    `json:"type"` // 0=Playing, 1=Streaming, 2=Listening, 3=Watching, 4=Custom, 5=Competing
			State         string `json:"state"`
			Details       string `json:"details"`
			ApplicationID string `json:"application_id,omitempty"`
			Timestamps    struct {
				Start int64 `json:"start,omitempty"`
				End   int64 `json:"end,omitempty"`
			} `json:"timestamps,omitempty"`
		} `json:"activities"`
		Spotify *struct {
			TrackID    string `json:"track_id"`
			Song       string `json:"song"`
			Artist     string `json:"artist"`
			Album      string `json:"album"`
			AlbumArt   string `json:"album_art_url"`
			Timestamps struct {
				Start int64 `json:"start"`
				End   int64 `json:"end"`
			} `json:"timestamps"`
		} `json:"spotify"`
	} `json:"data"`
}

type DiscordActivity struct {
	Status       string `json:"status"`
	CustomStatus string `json:"customStatus,omitempty"`
	Activity     string `json:"activity,omitempty"`
	Details      string `json:"details,omitempty"`
	State        string `json:"state,omitempty"`
	Application  string `json:"application,omitempty"`
	Timestamp    int64  `json:"timestamp,omitempty"`
}

func NewDiscordService() *DiscordService {
	return &DiscordService{
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (d *DiscordService) GetActivity() (*DiscordActivity, error) {
	cfg := config.AppConfig

	url := fmt.Sprintf("https://api.lanyard.rest/v1/users/%s", cfg.DiscordUserID)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	resp, err := d.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get discord activity: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("lanyard API error %d: %s", resp.StatusCode, string(body))
	}

	var lanyardResp lanyardResponse
	if err := json.NewDecoder(resp.Body).Decode(&lanyardResp); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	if !lanyardResp.Success {
		return nil, fmt.Errorf("lanyard API returned success=false")
	}

	activity := &DiscordActivity{
		Status: lanyardResp.Data.DiscordStatus,
	}

	// Parse activities
	for _, act := range lanyardResp.Data.Activities {
		switch act.Type {
		case 4: // Custom status
			activity.CustomStatus = act.State
		case 0: // Playing
			if activity.Activity == "" { // Only set if not already set
				activity.Activity = "Playing"
				activity.Application = act.Name
				activity.Details = act.Details
				activity.State = act.State
				if act.Timestamps.Start > 0 {
					activity.Timestamp = act.Timestamps.Start
				}
			}
		case 2: // Listening
			if activity.Activity == "" {
				activity.Activity = "Listening"
				activity.Application = act.Name
				activity.Details = act.Details
				activity.State = act.State
			}
		case 3: // Watching
			if activity.Activity == "" {
				activity.Activity = "Watching"
				activity.Application = act.Name
				activity.Details = act.Details
				activity.State = act.State
			}
		case 5: // Competing
			if activity.Activity == "" {
				activity.Activity = "Competing"
				activity.Application = act.Name
				activity.Details = act.Details
				activity.State = act.State
			}
		}
	}

	return activity, nil
}
