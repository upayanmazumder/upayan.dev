package services

import (
	"fmt"
	"net/http"
	"sync"
	"time"

	discordgo "github.com/bwmarrin/discordgo"
	"github.com/upayanmazumder/upayan.dev/apps/api/internal/config"
)

type DiscordService struct {
	client      *http.Client
	dg          *discordgo.Session
	userID      string
	activityMux sync.RWMutex
	guildStatus map[string]*GuildStatus
}

type GuildStatus struct {
	GuildID       string             `json:"guildId"`
	GuildName     string             `json:"guildName,omitempty"`
	GuildIconURL  string             `json:"guildIconUrl,omitempty"`
	DiscordStatus string             `json:"discordStatus"`
	Activities    []*DiscordActivity `json:"activities"`
	LastUpdated   int64              `json:"lastUpdated"`
}

type DiscordActivity struct {
	Status         string `json:"status"`
	Type           string `json:"type,omitempty"`
	CustomStatus   string `json:"customStatus,omitempty"`
	Activity       string `json:"activity,omitempty"`
	Details        string `json:"details,omitempty"`
	State          string `json:"state,omitempty"`
	Application    string `json:"application,omitempty"`
	URL            string `json:"url,omitempty"`
	CreatedAt      int64  `json:"createdAt,omitempty"`
	StartTimestamp int64  `json:"startTimestamp,omitempty"`
	EndTimestamp   int64  `json:"endTimestamp,omitempty"`
	EmojiName      string `json:"emojiName,omitempty"`
	EmojiID        string `json:"emojiId,omitempty"`
	EmojiAnimated  bool   `json:"emojiAnimated,omitempty"`
	LargeImage     string `json:"largeImage,omitempty"`
	LargeText      string `json:"largeText,omitempty"`
	SmallImage     string `json:"smallImage,omitempty"`
	SmallText      string `json:"smallText,omitempty"`
	PartyID        string `json:"partyId,omitempty"`
	PartySize      int    `json:"partySize,omitempty"`
	PartyMax       int    `json:"partyMax,omitempty"`
}

func NewDiscordService() *DiscordService {
	ds := &DiscordService{
		client:      &http.Client{Timeout: 10 * time.Second},
		userID:      config.AppConfig.DiscordUserID,
		guildStatus: make(map[string]*GuildStatus),
	}

	dg, err := discordgo.New("Bot " + config.AppConfig.DiscordBotToken)
	if err == nil {
		dg.Identify.Intents = discordgo.IntentsGuilds | discordgo.IntentsGuildPresences | discordgo.IntentsGuildMembers
		ds.dg = dg
		dg.AddHandler(ds.handlePresenceUpdate)
		dg.AddHandler(ds.handleReady)
		_ = dg.Open()
	}

	return ds
}

func (ds *DiscordService) handleReady(s *discordgo.Session, r *discordgo.Ready) {
	for _, g := range r.Guilds {
		s.RequestGuildMembers(g.ID, "", 0, "", false)

		iconURL := ""
		if g.Icon != "" {
			iconURL = fmt.Sprintf("https://cdn.discordapp.com/icons/%s/%s.png", g.ID, g.Icon)
		}

		// Initialize guild entry as offline to avoid empty payloads before first presence update
		ds.activityMux.Lock()
		ds.guildStatus[g.ID] = &GuildStatus{
			GuildID:       g.ID,
			GuildName:     g.Name,
			GuildIconURL:  iconURL,
			DiscordStatus: "offline",
			Activities:    []*DiscordActivity{},
			LastUpdated:   time.Now().Unix(),
		}
		ds.activityMux.Unlock()
	}
}

func (ds *DiscordService) handlePresenceUpdate(s *discordgo.Session, p *discordgo.PresenceUpdate) {
	if p.User.ID != ds.userID {
		return
	}

	activities := make([]*DiscordActivity, 0, len(p.Activities))
	for _, a := range p.Activities {
		activity := &DiscordActivity{
			Status:         string(p.Status),
			Type:           activityTypeToString(a.Type),
			Activity:       a.Name,
			Details:        a.Details,
			State:          a.State,
			Application:    a.ApplicationID,
			URL:            a.URL,
			StartTimestamp: a.Timestamps.StartTimestamp,
			EndTimestamp:   a.Timestamps.EndTimestamp,
			LargeImage:     a.Assets.LargeImageID,
			LargeText:      a.Assets.LargeText,
			SmallImage:     a.Assets.SmallImageID,
			SmallText:      a.Assets.SmallText,
			PartyID:        a.Party.ID,
		}
		if !a.CreatedAt.IsZero() {
			activity.CreatedAt = a.CreatedAt.Unix()
		}
		if a.Type == discordgo.ActivityTypeCustom {
			activity.CustomStatus = a.State
		}
		if a.Emoji.ID != "" || a.Emoji.Name != "" {
			activity.EmojiName = a.Emoji.Name
			activity.EmojiID = a.Emoji.ID
			activity.EmojiAnimated = a.Emoji.Animated
		}
		if len(a.Party.Size) == 2 {
			activity.PartySize = a.Party.Size[0]
			activity.PartyMax = a.Party.Size[1]
		}
		activities = append(activities, activity)
	}

	ds.activityMux.Lock()
	current := ds.guildStatus[p.GuildID]
	guildName := ""
	iconURL := ""
	if current != nil {
		guildName = current.GuildName
		iconURL = current.GuildIconURL
	}
	ds.guildStatus[p.GuildID] = &GuildStatus{
		GuildID:       p.GuildID,
		GuildName:     guildName,
		GuildIconURL:  iconURL,
		DiscordStatus: string(p.Status),
		Activities:    activities,
		LastUpdated:   time.Now().Unix(),
	}
	ds.activityMux.Unlock()
}

func (ds *DiscordService) GetGuildStatuses() ([]*GuildStatus, error) {
	ds.activityMux.RLock()
	defer ds.activityMux.RUnlock()

	if len(ds.guildStatus) == 0 {
		return []*GuildStatus{{
			GuildID:       "",
			DiscordStatus: "offline",
			Activities:    []*DiscordActivity{},
		}}, nil
	}

	statuses := make([]*GuildStatus, 0, len(ds.guildStatus))
	for _, status := range ds.guildStatus {
		statuses = append(statuses, status)
	}
	return statuses, nil
}

func activityTypeToString(t discordgo.ActivityType) string {
	switch t {
	case discordgo.ActivityTypeGame:
		return "playing"
	case discordgo.ActivityTypeStreaming:
		return "streaming"
	case discordgo.ActivityTypeListening:
		return "listening"
	case discordgo.ActivityTypeWatching:
		return "watching"
	case discordgo.ActivityTypeCustom:
		return "custom"
	case discordgo.ActivityTypeCompeting:
		return "competing"
	default:
		return "unknown"
	}
}
