package main

import (
	"fmt"

	"github.com/signageful/client/cmd/monitor/container"
	"github.com/signageful/client/cmd/monitor/middleware"
	"github.com/signageful/client/cmd/monitor/server"
)

func main() {
	providers := getProviders()
	mainServer := server.CreateDefaultServer(providers)

	if err := mainServer.Start(":58501"); err != nil {
		fmt.Printf("Error starting server: %v", err)
	}
}

func getProviders() middleware.Providers {
	return middleware.Providers{
		Container: container.NewContainerProvider(),
	}
}
