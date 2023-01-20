package handlers

import "github.com/signageful/client/cmd/monitor/middleware"

func GetStats(ctx *middleware.Context) error {
	return ctx.JSON(200, ctx.Providers.Container.Collect())
}
