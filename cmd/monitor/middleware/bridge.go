package middleware

import "github.com/labstack/echo/v4"

// Bridge represents the func signature that returns a echo context
type Bridge = func(RequestHandler) echo.HandlerFunc

// BridgeBuilder is used to build a Bridge.
type BridgeBuilder struct {
	providers Providers
}

// NewBridgeBuilder creates a new BridgeBuilder.
func NewBridgeBuilder() *BridgeBuilder {
	return &BridgeBuilder{}
}

// WithProviders sets the Providers used with this BridgeBuilder.
func (b *BridgeBuilder) WithProviders(providers Providers) *BridgeBuilder {
	b.providers = providers

	return b
}

// Build and return the Bridge configured by this BridgeBuilder.
func (b *BridgeBuilder) Build() Bridge {

	return func(next RequestHandler) echo.HandlerFunc {
		bridge := func(c echo.Context) error {
			return next(NewContext(c, b.providers))
		}

		return bridge
	}
}
