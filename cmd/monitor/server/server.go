package server

import (
	"github.com/labstack/echo/v4"
	"github.com/signageful/client/cmd/monitor/handlers"
	"github.com/signageful/client/cmd/monitor/middleware"
	"github.com/signageful/client/cmd/monitor/ws"
)

func CreateDefaultServer(providers middleware.Providers) *echo.Echo {
	server := echo.New()
	server.HideBanner = true

	mw := middleware.NewBridgeBuilder().WithProviders(providers).Build()

	server.GET("/api/system/info", mw(handlers.GetSystemInfo))
	server.GET("/api/screensaver/ws", mw(handlers.WsScreensaver))

	server.GET("/ws", mw(func(ctx *middleware.Context) error {
		ws.ServeWS(providers.Hub, ctx)
		return nil
	}))

	return server
}
