//go:build !windows
// +build !windows

package container

import "github.com/mackerelio/go-osstat/memory"

func (gen *memoryGenerator) Collect() *Memory {
	memory, err := memory.Get()
	if err != nil {
		return &Memory{}
	}

	return &Memory{
		Total:     memory.Total,
		Used:      memory.Used,
		Cached:    memory.Cached,
		Free:      memory.Free,
		Active:    memory.Active,
		Inactive:  memory.Inactive,
		SwapTotal: memory.SwapTotal,
		SwapUsed:  memory.SwapUsed,
		SwapFree:  memory.SwapFree,
	}
}
