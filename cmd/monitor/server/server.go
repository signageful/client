package server

import (
	"github.com/labstack/echo/v4"
	"github.com/signageful/client/cmd/monitor/handlers"
	"github.com/signageful/client/cmd/monitor/middleware"
)

func CreateDefaultServer(providers middleware.Providers) *echo.Echo {
	server := echo.New()
	server.HideBanner = true

	mw := middleware.NewBridgeBuilder().WithProviders(providers).Build()

	server.GET("/api/system/info", mw(handlers.GetSystemInfo))

	return server
}
