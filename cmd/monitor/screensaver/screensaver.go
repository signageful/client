package screensaver

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/signageful/client/cmd/monitor/ws"
)

type Screensaver struct {
	/**
	 * if this feature is enabled
	 */
	hub       *ws.Hub
	isEnabled bool
	// theshold is in seconds
	threshold int
	source    string
	// sync mutex
	mu sync.Mutex

	ticker *time.Timer
}

const (
	SCREENSAVER_REGISTER ws.MessageKey = "screensaver.register"
	SCREENSAVER_REFRESH  ws.MessageKey = "screensaver.refresh"
	SCREENSAVER_DISABLE  ws.MessageKey = "screensaver.disable"
	SCREENSAVER_SHOW     ws.MessageKey = "screensaver.show"
)

func NewScreensaverProvider(hub *ws.Hub) *Screensaver {

	scrv := &Screensaver{
		isEnabled: false,
		threshold: 0,
		source:    "",
		hub:       hub,
	}

	scrv.hub.RegisterHandler(SCREENSAVER_REGISTER, scrv.registerMessageHandler)
	scrv.hub.RegisterHandler(SCREENSAVER_REFRESH, scrv.handleRefresh)
	scrv.hub.RegisterHandler(SCREENSAVER_DISABLE, scrv.handleDisable)

	return scrv
}

func (s *Screensaver) registerMessageHandler(data json.RawMessage) error {
	// convert data to Options
	options := ScreensaverOptions{}
	if err := json.Unmarshal(data, &options); err != nil {
		fmt.Println(err)
		return err
	}

	s.Register(options)

	return nil
}

func (s *Screensaver) handleRefresh(data json.RawMessage) error {
	if s.ticker != nil {
		s.ticker.Reset(time.Duration(s.threshold) * time.Second)
	}

	return nil
}

func (s *Screensaver) handleDisable(data json.RawMessage) error {
	if s.ticker != nil {
		s.ticker.Stop()
		s.ticker = nil
	}

	s.isEnabled = false
	s.threshold = 0
	s.source = ""

	return nil
}

func (s *Screensaver) Register(options ScreensaverOptions) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if !options.IsValid() {
		return fmt.Errorf("Invalid options")
	}

	s.isEnabled = true
	s.threshold = options.Threshold
	s.source = options.Source

	// start ticker
	go s.startTicker()

	return nil
}

func (s *Screensaver) resetTicker() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.ticker != nil {
		s.ticker.Reset(time.Second * time.Duration(s.threshold))
	}
}

func (s *Screensaver) setOrResetTicker() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.ticker == nil {
		s.ticker = time.NewTimer(time.Second * time.Duration(s.threshold))
	} else {
		s.ticker.Reset(time.Second * time.Duration(s.threshold))
	}
}

func (s *Screensaver) startTicker() {
	if !s.isEnabled {
		return
	}

	s.setOrResetTicker()

	for {
		select {
		case <-s.ticker.C:
			s.hub.BroadcastMessage(ws.WebsocketMessage{
				Action: SCREENSAVER_SHOW,
				Data:   s.source,
			})
		}
	}

}
