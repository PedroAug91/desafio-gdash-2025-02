package models

type TimeRange struct {
	Start int64 `json:"start"`
	End   int64 `json:"end"`
}

type CurrentWeather struct {
	Time            TimeRange `json:"time"`
	Temperature     float64   `json:"temperature"`
	RelativeHumidity float64  `json:"relative_humidity"`
	WeatherCode     float64       `json:"weather_code"`
	WindSpeed       float64   `json:"wind_speed"`
}

type HourlyWeather struct {
	Time            TimeRange `json:"time"`
	Temperature     float64 `json:"temperature"`
	RelativeHumidity float64 `json:"relative_humidity"`
	WeatherCode     float64     `json:"weather_code"`
	WindSpeed       float64 `json:"wind_speed"`
}

type WeatherData struct {
	Latitude       float64        `json:"latitude"`
	Longitude      float64        `json:"longitude"`
	Elevation      float64        `json:"elevation"`
	CurrentWeather CurrentWeather `json:"current_weather"`
	HourlyWeather  HourlyWeather  `json:"hourly_weather"`
}


