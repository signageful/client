package container

import "github.com/mackerelio/go-osstat/cpu"

type cpuGenerator struct{}

type CPU struct {
	User   uint64 `json:"user"`
	System uint64 `json:"system"`
	Idle   uint64 `json:"idle"`
	Nice   uint64 `json:"nice"`
	Total  uint64 `json:"total"`
}

func (gen *cpuGenerator) Collect() *CPU {
	cpu, err := cpu.Get()
	if err != nil {
		return &CPU{}
	}

	return &CPU{
		User:   cpu.User,
		System: cpu.System,
		Idle:   cpu.Idle,
		Nice:   cpu.Nice,
		Total:  cpu.Total,
	}
}
