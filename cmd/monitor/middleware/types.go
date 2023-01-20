package middleware

import "github.com/signageful/client/cmd/monitor/container"

// RequestHandler represents an authy request handler.
type RequestHandler = func(*Context) error

// Providers contain all provider provided to monitor.
type Providers struct {
	Container *container.Container
}
