package middleware

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type Context struct {
	echo.Context

	Providers Providers
}

func NewContext(requestCtx echo.Context, providers Providers) *Context {
	return &Context{
		Context:   requestCtx,
		Providers: providers,
	}
}

func (ctx *Context) SetJSONBody(value any) error {
	return ctx.Context.JSON(http.StatusOK, OKResponse{
		Data:   value,
		Status: "OK",
	})
}
