package handlers

import "github.com/signageful/client/cmd/monitor/middleware"

func GetSystemInfo(ctx *middleware.Context) error {
	return ctx.SetJSONBody(ctx.Providers.Container.Collect())
}
