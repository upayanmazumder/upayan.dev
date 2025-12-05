package services

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	"github.com/upayanmazumder/upayan.dev/apps/api/internal/config"
)

type SpotifyService struct {
	accessToken string
	expiresAt   time.Time
	client      *http.Client
}

type spotifyTokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
}

type spotifyCurrentlyPlaying struct {
	IsPlaying bool `json:"is_playing"`
	Item      *struct {
		Name       string `json:"name"`
		DurationMs int    `json:"duration_ms"`
		Album      struct {
			Name   string `json:"name"`
			Images []struct {
				URL string `json:"url"`
			} `json:"images"`
		} `json:"album"`
		Artists []struct {
			Name string `json:"name"`
		} `json:"artists"`
		ExternalURLs struct {
			Spotify string `json:"spotify"`
		} `json:"external_urls"`
	} `json:"item"`
	ProgressMs int `json:"progress_ms"`
}

type SpotifyActivity struct {
	IsPlaying bool   `json:"isPlaying"`
	TrackName string `json:"trackName,omitempty"`
	Artist    string `json:"artist,omitempty"`
	Album     string `json:"album,omitempty"`
	AlbumArt  string `json:"albumArt,omitempty"`
	TrackURL  string `json:"trackUrl,omitempty"`
	Progress  int    `json:"progress,omitempty"`
	Duration  int    `json:"duration,omitempty"`
}

func NewSpotifyService() *SpotifyService {
	return &SpotifyService{
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (s *SpotifyService) refreshAccessToken() error {
	cfg := config.AppConfig

	data := url.Values{}
	data.Set("grant_type", "refresh_token")
	data.Set("refresh_token", cfg.SpotifyRefreshToken)

	req, err := http.NewRequest("POST", "https://accounts.spotify.com/api/token", bytes.NewBufferString(data.Encode()))
	if err != nil {
		return fmt.Errorf("failed to create token request: %w", err)
	}

	auth := base64.StdEncoding.EncodeToString([]byte(cfg.SpotifyClientID + ":" + cfg.SpotifyClientSecret))
	req.Header.Set("Authorization", "Basic "+auth)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to refresh token: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("spotify token refresh failed with status %d: %s", resp.StatusCode, string(body))
	}

	var tokenResp spotifyTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return fmt.Errorf("failed to decode token response: %w", err)
	}

	s.accessToken = tokenResp.AccessToken
	s.expiresAt = time.Now().Add(time.Duration(tokenResp.ExpiresIn) * time.Second)

	return nil
}

func (s *SpotifyService) ensureValidToken() error {
	if s.accessToken == "" || time.Now().After(s.expiresAt.Add(-5*time.Minute)) {
		return s.refreshAccessToken()
	}
	return nil
}

func (s *SpotifyService) GetCurrentlyPlaying() (*SpotifyActivity, error) {
	if err := s.ensureValidToken(); err != nil {
		return nil, err
	}

	req, err := http.NewRequest("GET", "https://api.spotify.com/v1/me/player/currently-playing", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+s.accessToken)

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to get currently playing: %w", err)
	}
	defer resp.Body.Close()

	// No content means nothing is playing
	if resp.StatusCode == http.StatusNoContent {
		return &SpotifyActivity{
			IsPlaying: false,
		}, nil
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("spotify API error %d: %s", resp.StatusCode, string(body))
	}

	var playing spotifyCurrentlyPlaying
	if err := json.NewDecoder(resp.Body).Decode(&playing); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	activity := &SpotifyActivity{
		IsPlaying: playing.IsPlaying,
	}

	if playing.Item != nil {
		activity.TrackName = playing.Item.Name
		activity.Duration = playing.Item.DurationMs
		activity.Album = playing.Item.Album.Name
		activity.TrackURL = playing.Item.ExternalURLs.Spotify
		activity.Progress = playing.ProgressMs

		if len(playing.Item.Artists) > 0 {
			activity.Artist = playing.Item.Artists[0].Name
			// Add additional artists
			for i := 1; i < len(playing.Item.Artists); i++ {
				activity.Artist += ", " + playing.Item.Artists[i].Name
			}
		}

		if len(playing.Item.Album.Images) > 0 {
			activity.AlbumArt = playing.Item.Album.Images[0].URL
		}
	}

	return activity, nil
}
