package container

import (
	"time"

	"github.com/mackerelio/go-osstat/uptime"
)

type uptimeGenerator struct {
	uptime time.Duration
	err    error
}

type Uptime struct {
	Uptime time.Duration `json:"uptime"`
}

func (gen *uptimeGenerator) Collect() *Uptime {
	out := &Uptime{}

	uptime, err := uptime.Get()
	if err != nil {
		return out
	}
	out.Uptime = uptime

	return out
}
