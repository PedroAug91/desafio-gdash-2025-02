package main

import (
	"log"
	"worker/weather-app-worker/config"
	"worker/weather-app-worker/receiver"
	"worker/weather-app-worker/sender"
)

func main() {
	cfg := config.Load()

	apiClient := sender.NewAPIClient(cfg.APIURL)

	mqReceiver := receiver.NewRabbitMQReceiver(cfg.RabbitMQURL, cfg.QueueName)

	mqReceiver.SetHandler(func(body []byte) error {
		log.Printf("Processing message")
		return apiClient.SendWeatherData(body)
	})

	log.Println("[*] Weather worker started. Waiting for messages...")
	if err := mqReceiver.Start(); err != nil {
		log.Fatalf("Failed to start receiver: %v", err)
	}
}

