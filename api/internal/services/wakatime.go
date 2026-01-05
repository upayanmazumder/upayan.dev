package services

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/upayanmazumder/upayan.dev/apps/backend/internal/config"
)

type WakatimeService struct {
	apiKey string
	client *http.Client
}

type wakatimeStatusResponse struct {
	Data wakatimeStatusData `json:"data"`
}

type wakatimeStatusData struct {
	Status            string             `json:"status"`
	GrandTotal        wakatimeGrandTotal `json:"grand_total"`
	Projects          []wakatimeEntity   `json:"projects"`
	Languages         []wakatimeEntity   `json:"languages"`
	Editors           []wakatimeEntity   `json:"editors"`
	OperatingSystems  []wakatimeEntity   `json:"operating_systems"`
	Categories        []wakatimeEntity   `json:"categories"`
	Dependencies      []wakatimeEntity   `json:"dependencies"`
	Machines          []wakatimeEntity   `json:"machines"`
	Branches          []wakatimeEntity   `json:"branches"`
	Range             wakatimeRange      `json:"range"`
	Timeout           int                `json:"timeout"`
	PercentCalculated float64            `json:"percent_calculated"`
	IsUpToDate        bool               `json:"is_up_to_date"`
}

type wakatimeGrandTotal struct {
	Text         string  `json:"text"`
	TotalSeconds float64 `json:"total_seconds"`
	Digital      string  `json:"digital"`
	Hours        int     `json:"hours"`
	Minutes      int     `json:"minutes"`
}

type wakatimeEntity struct {
	Name         string  `json:"name"`
	TotalSeconds float64 `json:"total_seconds"`
	Text         string  `json:"text"`
	Percent      float64 `json:"percent"`
}

type wakatimeRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
	Date  string `json:"date"`
	Text  string `json:"text"`
}

// WakatimeActivity is the pared-down status payload we return to clients.
type WakatimeActivity struct {
	Status            string           `json:"status"`
	TotalSeconds      float64          `json:"totalSeconds,omitempty"`
	HumanReadable     string           `json:"humanReadable,omitempty"`
	Digital           string           `json:"digital,omitempty"`
	Projects          []wakatimeEntity `json:"projects,omitempty"`
	Languages         []wakatimeEntity `json:"languages,omitempty"`
	Editors           []wakatimeEntity `json:"editors,omitempty"`
	OperatingSystems  []wakatimeEntity `json:"operatingSystems,omitempty"`
	Categories        []wakatimeEntity `json:"categories,omitempty"`
	Dependencies      []wakatimeEntity `json:"dependencies,omitempty"`
	Machines          []wakatimeEntity `json:"machines,omitempty"`
	Branches          []wakatimeEntity `json:"branches,omitempty"`
	Range             wakatimeRange    `json:"range"`
	Timeout           int              `json:"timeout,omitempty"`
	PercentCalculated float64          `json:"percentCalculated,omitempty"`
	IsUpToDate        bool             `json:"isUpToDate,omitempty"`
}

func NewWakatimeService() *WakatimeService {
	return &WakatimeService{
		apiKey: strings.TrimSpace(config.AppConfig.WakatimeAPIKey),
		client: &http.Client{Timeout: 10 * time.Second},
	}
}

// GetTodayStatus fetches the current day's status bar from Wakatime.
func (ws *WakatimeService) GetTodayStatus() (*WakatimeActivity, error) {
	if ws.apiKey == "" {
		return nil, errors.New("wakatime api key is not configured")
	}

	req, err := http.NewRequest("GET", "https://wakatime.com/api/v1/users/current/status_bar/today", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create wakatime request: %w", err)
	}

	// Wakatime expects Basic auth with the API key as username and an empty password
	encodedKey := base64.StdEncoding.EncodeToString([]byte(ws.apiKey + ":"))
	req.Header.Set("Authorization", "Basic "+encodedKey)
	req.Header.Set("X-Api-Key", ws.apiKey)

	resp, err := ws.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to call wakatime: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var msg strings.Builder
		msg.WriteString(fmt.Sprintf("wakatime api error %d", resp.StatusCode))
		if body, err := io.ReadAll(resp.Body); err == nil && len(body) > 0 {
			msg.WriteString(": ")
			msg.Write(body)
		}
		return nil, errors.New(msg.String())
	}

	var statusResp wakatimeStatusResponse
	if err := json.NewDecoder(resp.Body).Decode(&statusResp); err != nil {
		return nil, fmt.Errorf("failed to decode wakatime response: %w", err)
	}

	data := statusResp.Data
	activity := &WakatimeActivity{
		Status:            data.Status,
		TotalSeconds:      data.GrandTotal.TotalSeconds,
		HumanReadable:     data.GrandTotal.Text,
		Digital:           data.GrandTotal.Digital,
		Projects:          data.Projects,
		Languages:         data.Languages,
		Editors:           data.Editors,
		OperatingSystems:  data.OperatingSystems,
		Categories:        data.Categories,
		Dependencies:      data.Dependencies,
		Machines:          data.Machines,
		Branches:          data.Branches,
		Range:             data.Range,
		Timeout:           data.Timeout,
		PercentCalculated: data.PercentCalculated,
		IsUpToDate:        data.IsUpToDate,
	}

	return activity, nil
}
