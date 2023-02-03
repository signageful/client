package ws

import (
	"encoding/json"
	"fmt"
	"log"
)

type Hub struct {
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan []byte

	handlers map[MessageKey]MessageHandler
}

type MessageKey string

type MessageHandler func(json.RawMessage) error

type Config struct{}

// NewWebsocketHub creates a new Hub
func NewWebsocketHub(c *Config) *Hub {
	h := &Hub{
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan []byte),
		handlers:   make(map[MessageKey]MessageHandler),
	}

	go h.Run()
	return h
}

func (h *Hub) RegisterHandler(key MessageKey, handler MessageHandler) {
	h.handlers[key] = handler
}

func (h *Hub) handle(message ReceivedMessage) {
	if handler, ok := h.handlers[message.Action]; ok {
		handler(message.Data)
	}
}

// Run our websocket server, accepting various requests
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.registerClient(client)
		case client := <-h.unregister:
			h.unregisterClient(client)
		case message := <-h.broadcast:
			h.broadcastToClients(message)
		}

	}
}

func (h *Hub) registerClient(client *Client) {
	fmt.Println("registering a new client")
	h.clients[client] = true
}

func (h *Hub) unregisterClient(client *Client) {
	if _, ok := h.clients[client]; ok {
		delete(h.clients, client)
	}
}

func (h *Hub) BroadcastMessage(message WebsocketMessage) {
	for client := range h.clients {
		client.send <- message.Encode()
	}
}

// WebsocketMessage represents an emitted message
type WebsocketMessage struct {
	Action MessageKey  `json:"action"`
	Data   interface{} `json:"data"`
}

// Encode turns the message into a byte array
func (message *WebsocketMessage) Encode() []byte {
	encoding, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	return encoding
}

func (h *Hub) broadcastToClients(message []byte) {
	for client := range h.clients {
		fmt.Println("Sending message to client")
		client.send <- message
	}
}
