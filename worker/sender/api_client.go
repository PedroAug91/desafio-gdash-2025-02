package sender

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
	"worker/weather-app-worker/models"
)

type APIClient struct {
	baseURL    string
	httpClient *http.Client
}

func NewAPIClient(baseURL string) *APIClient {
	return &APIClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (c *APIClient) SendWeatherData(data []byte) error {
	var weatherData models.WeatherData
	if err := json.Unmarshal(data, &weatherData); err != nil {
		return fmt.Errorf("invalid JSON format: %w", err)
	}

	endpoint, err := url.JoinPath(c.baseURL, "weather")

	if err != nil {
		return  fmt.Errorf("Could not join the API path: %w", err)
	}
	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(data))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("API returned error status %d: %s", resp.StatusCode, string(body))
	}

	return nil
}

func (c *APIClient) SendWeatherDataWithRetry(data []byte, maxRetries int) error {
	var lastErr error

	for attempt := range maxRetries {
		if attempt > 0 {
			waitTime := time.Duration(attempt*attempt) * time.Second
			time.Sleep(waitTime)
		}

		err := c.SendWeatherData(data)
		if err == nil {
			return nil
		}

		lastErr = err
		fmt.Printf("Attempt %d failed: %v\n", attempt+1, err)
	}

	return fmt.Errorf("failed after %d attempts: %w", maxRetries, lastErr)
}
