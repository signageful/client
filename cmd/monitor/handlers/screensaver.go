package handlers

import (
	"fmt"

	"github.com/signageful/client/cmd/monitor/middleware"
	"golang.org/x/net/websocket"
)

func ScreensaverRegister(ctx *middleware.Context) {}

func ScreensaverUnregister(ctx *middleware.Context) {}

func WsScreensaver(ctx *middleware.Context) error {
	websocket.Handler(func(ws *websocket.Conn) {
		defer ws.Close()

		// Write
		err := websocket.Message.Send(ws, "Hello")
		if err != nil {
			ctx.Logger().Error(err)
		}

		for {
			msg := ""
			err = websocket.Message.Receive(ws, &msg)
			if err != nil {
				ctx.Logger().Error(err)
			}
			fmt.Printf("%s\n", msg)
		}
	}).ServeHTTP(ctx.Response(), ctx.Request())

	return nil
}
