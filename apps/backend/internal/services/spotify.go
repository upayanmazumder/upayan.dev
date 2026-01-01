package services

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/upayanmazumder/upayan.dev/apps/backend/internal/config"
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
	Device    struct {
		ID               string `json:"id"`
		Name             string `json:"name"`
		Type             string `json:"type"`
		VolumePercent    int    `json:"volume_percent"`
		IsActive         bool   `json:"is_active"`
		IsPrivateSession bool   `json:"is_private_session"`
		IsRestricted     bool   `json:"is_restricted"`
	} `json:"device"`
	ShuffleState         bool   `json:"shuffle_state"`
	RepeatState          string `json:"repeat_state"`
	Timestamp            int64  `json:"timestamp"`
	CurrentlyPlayingType string `json:"currently_playing_type"`
	Context              *struct {
		Type         string `json:"type"`
		URI          string `json:"uri"`
		ExternalURLs struct {
			Spotify string `json:"spotify"`
		} `json:"external_urls"`
	} `json:"context"`
	Item *struct {
		Name        string `json:"name"`
		DurationMs  int    `json:"duration_ms"`
		Explicit    bool   `json:"explicit"`
		TrackNumber int    `json:"track_number"`
		DiscNumber  int    `json:"disc_number"`
		Popularity  int    `json:"popularity"`
		PreviewURL  string `json:"preview_url"`
		Album       struct {
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
	IsPlaying    bool     `json:"isPlaying"`
	TrackName    string   `json:"trackName,omitempty"`
	Artist       string   `json:"artist,omitempty"`
	Artists      []string `json:"artists,omitempty"`
	Album        string   `json:"album,omitempty"`
	AlbumArt     string   `json:"albumArt,omitempty"`
	AlbumImages  []string `json:"albumImages,omitempty"`
	TrackURL     string   `json:"trackUrl,omitempty"`
	PreviewURL   string   `json:"previewUrl,omitempty"`
	Progress     int      `json:"progress,omitempty"`
	Duration     int      `json:"duration,omitempty"`
	Explicit     bool     `json:"explicit,omitempty"`
	TrackNumber  int      `json:"trackNumber,omitempty"`
	DiscNumber   int      `json:"discNumber,omitempty"`
	Popularity   int      `json:"popularity,omitempty"`
	ContextType  string   `json:"contextType,omitempty"`
	ContextURI   string   `json:"contextUri,omitempty"`
	ContextURL   string   `json:"contextUrl,omitempty"`
	DeviceName   string   `json:"deviceName,omitempty"`
	DeviceType   string   `json:"deviceType,omitempty"`
	DeviceVolume int      `json:"deviceVolume,omitempty"`
	Shuffle      bool     `json:"shuffle,omitempty"`
	Repeat       string   `json:"repeat,omitempty"`
	PlayingType  string   `json:"playingType,omitempty"`
	Timestamp    int64    `json:"timestamp,omitempty"`
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
		IsPlaying:    playing.IsPlaying,
		DeviceName:   playing.Device.Name,
		DeviceType:   playing.Device.Type,
		DeviceVolume: playing.Device.VolumePercent,
		Shuffle:      playing.ShuffleState,
		Repeat:       playing.RepeatState,
		PlayingType:  playing.CurrentlyPlayingType,
		Timestamp:    playing.Timestamp,
		Progress:     playing.ProgressMs,
	}

	if playing.Context != nil {
		activity.ContextType = playing.Context.Type
		activity.ContextURI = playing.Context.URI
		activity.ContextURL = playing.Context.ExternalURLs.Spotify
	}

	if playing.Item != nil {
		activity.TrackName = playing.Item.Name
		activity.Duration = playing.Item.DurationMs
		activity.Album = playing.Item.Album.Name
		activity.TrackURL = playing.Item.ExternalURLs.Spotify
		activity.PreviewURL = playing.Item.PreviewURL
		activity.Explicit = playing.Item.Explicit
		activity.TrackNumber = playing.Item.TrackNumber
		activity.DiscNumber = playing.Item.DiscNumber
		activity.Popularity = playing.Item.Popularity

		if len(playing.Item.Artists) > 0 {
			artists := make([]string, 0, len(playing.Item.Artists))
			for _, artist := range playing.Item.Artists {
				artists = append(artists, artist.Name)
			}
			activity.Artists = artists
			activity.Artist = strings.Join(artists, ", ")
		}

		if len(playing.Item.Album.Images) > 0 {
			images := make([]string, 0, len(playing.Item.Album.Images))
			for _, img := range playing.Item.Album.Images {
				images = append(images, img.URL)
			}
			activity.AlbumImages = images
			activity.AlbumArt = playing.Item.Album.Images[0].URL
		}
	}

	return activity, nil
}
