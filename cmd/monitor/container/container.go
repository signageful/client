package container

type Container struct {
	cpu    cpuGenerator
	memory memoryGenerator
	uptime uptimeGenerator
	system systemGenerator
}

func NewContainerProvider() *Container {
	return &Container{
		memory: memoryGenerator{},
		uptime: uptimeGenerator{},
		cpu:    cpuGenerator{},
		system: systemGenerator{},
	}
}

type SystemInfo struct {
	Memory *Memory `json:"memory"`
	Uptime *Uptime `json:"uptime"`
	CPU    *CPU    `json:"cpu"`
	System *System `json:"system"`
}

// Collect collects container stats.
func (c *Container) Collect() SystemInfo {
	return SystemInfo{
		CPU:    c.cpu.Collect(),
		Memory: c.memory.Collect(),
		Uptime: c.uptime.Collect(),
		System: c.system.Collect(),
	}
}
