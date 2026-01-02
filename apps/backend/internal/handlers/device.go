package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/upayanmazumder/upayan.dev/apps/backend/internal/config"
)

// DeviceData represents the payload sent by clients
type DeviceData struct {
	DeviceID    string                 `json:"deviceId,omitempty"`
	Battery     *int                   `json:"battery,omitempty"`
	Temperature *float64               `json:"temperature,omitempty"`
	Extra       map[string]interface{} `json:"extra,omitempty"`
}

// DeviceStatus stores the latest status for a device
type DeviceStatus struct {
	DeviceID  string                 `json:"deviceId"`
	Battery   *int                   `json:"battery,omitempty"`
	Extra     map[string]interface{} `json:"extra,omitempty"`
	UpdatedAt int64                  `json:"updatedAt"`
}

var (
	deviceStore = make(map[string]DeviceStatus)
	storeMutex  sync.RWMutex
)

// findDeviceByKey returns the device name that matches the provided key
func findDeviceByKey(key string) (string, bool) {
	if key == "" {
		return "", false
	}
	for name, k := range config.AppConfig.DeviceKeys {
		if k == key {
			return name, true
		}
	}
	return "", false
}

// ReceiveDeviceData handles incoming device reports. Clients must provide an API key
// via `Authorization: Bearer <key>` or `X-API-Key` header.
func ReceiveDeviceData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// extract key
	key := ""
	if auth := r.Header.Get("Authorization"); auth != "" {
		// support "Bearer <key>"
		const prefix = "Bearer "
		if len(auth) > len(prefix) && auth[:len(prefix)] == prefix {
			key = auth[len(prefix):]
		}
	}
	if key == "" {
		key = r.Header.Get("X-API-Key")
	}

	// fallback: allow key in query param for simple clients
	if key == "" {
		key = r.URL.Query().Get("key")
	}

	deviceName, ok := findDeviceByKey(key)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid api key"})
		return
	}

	var payload DeviceData
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		log.Printf("invalid device payload: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "invalid payload"})
		return
	}

	// prefer explicit device id in payload, else use deviceName from key
	did := payload.DeviceID
	if did == "" {
		did = deviceName
	}

	status := DeviceStatus{
		DeviceID:  did,
		Battery:   payload.Battery,
		Extra:     payload.Extra,
		UpdatedAt: time.Now().Unix(),
	}

	storeMutex.Lock()
	deviceStore[did] = status
	storeMutex.Unlock()

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// GetDevices exposes the latest known device statuses
func GetDevices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	storeMutex.RLock()
	defer storeMutex.RUnlock()

	list := make([]DeviceStatus, 0, len(deviceStore))
	for _, v := range deviceStore {
		list = append(list, v)
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"devices": list, "timestamp": time.Now().Unix()})
}
