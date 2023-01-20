package container

import (
	"net"
	"net/http"
	"os"
)

type System struct {
	Hostname         string `json:"hostname"`
	InternalIP       string `json:"internal_ip"`
	HasPublicNetwork bool   `json:"has_public_network"`
}

type systemGenerator struct {
}

func (gen *systemGenerator) Collect() *System {
	system := &System{}

	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown"
	}
	system.Hostname = hostname

	system.InternalIP = getInboundIP()
	system.HasPublicNetwork = hasInternetConnection()

	return system
}

func getInboundIP() string {
	ifaces, err := net.Interfaces()
	if err != nil {
		return "unknown"
	}

	for _, i := range ifaces {
		addrs, err := i.Addrs()
		if err != nil {
			return "unknown"
		}

		for _, addr := range addrs {
			var ip net.IP
			switch v := addr.(type) {
			case *net.IPNet:
				ip = v.IP
			case *net.IPAddr:
				ip = v.IP
			}

			if ip != nil && !ip.IsLoopback() && ip.To4() != nil {
				return ip.String()
			}
		}
	}

	return "unknown"
}

func hasInternetConnection() bool {
	_, err := http.Get("http://clients3.google.com/generate_204")
	if err != nil {
		return false
	}
	return true
}
