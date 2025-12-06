package config

import (
	"os"
)

type Config struct {
	RabbitMQURL string
	QueueName   string
	APIURL      string
}

func Load() *Config {
	return &Config{
		RabbitMQURL: getEnv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/"),
		QueueName:   getEnv("QUEUE_NAME", "weather_data"),
		APIURL:      getEnv("API_URL", "http://localhost:3000/weather"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

