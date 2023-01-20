package container

import "github.com/mackerelio/go-osstat/memory"

type memoryGenerator struct {
	memory *memory.Stats
	err    error
}

type Memory struct {
	Total     uint64 `json:"total"`
	Used      uint64 `json:"used"`
	Cached    uint64 `json:"cached"`
	Free      uint64 `json:"free"`
	Active    uint64 `json:"active"`
	Inactive  uint64 `json:"inactive"`
	SwapTotal uint64 `json:"swap_total"`
	SwapUsed  uint64 `json:"swap_used"`
	SwapFree  uint64 `json:"swap_free"`
}
