import openmeteo_requests
import requests_cache
from openmeteo_requests.Client import WeatherApiResponse
from retry_requests import retry

class WeatherAPI:
    def __init__(self, url, weather_params) -> None:
        self.url = url
        self.params = weather_params

    def call_weather_api(self) -> WeatherApiResponse:
        cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
        retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
        openmeteo = openmeteo_requests.Client(session=retry_session)

        responses = openmeteo.weather_api(self.url, self.params)
        # For this technical test we are only after Natal's (RN) weather data.
        return responses[0]

    def set_data(self, data: WeatherApiResponse):
        self.latitude = data.Latitude()
        self.longitude = data.Longitude()
        self.elevation = data.Elevation()
        self.hourly = data.Hourly()
        self.current = data.Current()

    def is_valid_data(self, data: WeatherApiResponse):
        if (
            not data.Hourly() or
            not data.Current() or
            not data.Longitude() or
            not data.Latitude() or
            not data.Elevation()
        ):
            return False
        return True

    def parse_weather_data(self):
        return {
            "latitute": self.latitude,
            "longitude": self.longitude,
            "elevation": self.elevation,
            "current_weather": {
                "time": {
                    "start": self.current.Time(),
                    "end": self.current.TimeEnd()
                },
                "temperature": self.current.Variables(0).Value(),
                "relative_humidity": self.current.Variables(1).Value(),
                "weather_code": self.current.Variables(2).Value(),
                "wind_speed": self.current.Variables(3).Value()
            },
            "hourly_weather": {
                "time": {
                    "start": self.hourly.Time(),
                    "end": self.hourly.TimeEnd()
                },
                "temperature": self.hourly.Variables(0).Value(),
                "relative_humidity": self.hourly.Variables(1).Value(),
                "weather_code": self.hourly.Variables(2).Value(),
                "wind_speed": self.hourly.Variables(3).Value()
            }
        }

    def get_parsed_weather_data(self):
        response = self.call_weather_api()

        if (not self.is_valid_data(response)):
            raise Exception("Invalid weather data")

        self.set_data(response)
        return self.parse_weather_data()

