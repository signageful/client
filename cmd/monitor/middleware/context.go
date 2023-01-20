package middleware

import "github.com/labstack/echo/v4"

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
