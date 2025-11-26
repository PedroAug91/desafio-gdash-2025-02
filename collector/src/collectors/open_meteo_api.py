import openmeteo_requests
import requests_cache
from retry_requests import retry

from parsers import OpenMeteoDataParser
from utils import Logger

class OpenMeteoAPI:
    def __init__(self, url, weather_params, parser: OpenMeteoDataParser, logger: Logger) -> None:
        self.url = url
        self.params = weather_params
        self.logger = logger
        self.parser = parser
        self.weather_data = None

    def call_weather_api(self):
        cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
        retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
        openmeteo = openmeteo_requests.Client(session=retry_session)

        try:
            self.weather_data = openmeteo.weather_api(self.url, self.params)[0] # Getting Natal's data
            self.logger.log_info("Collected weather data")
        except Exception as e:
            self.logger.log_error(f"Could not collect weather data {e}")
            raise e

        return self

    def parse_weather_data(self):
        if (not self.weather_data):
            self.logger.log_error("Could not parse weather data")
            raise Exception("No weather data is set")

        parsed_data = self.parser.set_weather_data(self.weather_data).parse_weather_data()

        if (not parsed_data):
            self.logger.log_error("Could not parse weather data")
            raise Exception("Parsed data is empty")

        return parsed_data

