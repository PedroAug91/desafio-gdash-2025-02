from openmeteo_requests.Client import WeatherApiResponse

from utils import Logger

class OpenMeteoDataParser:
    def __init__(self, logger: Logger) -> None:
        self.logger = logger
        self.data = None

    def set_weather_data(self, data: WeatherApiResponse):
        self.data = data
        return self

    def is_valid_data(self):
        entries_list = [
            ("'Hourly'", self.data.Hourly),
            ("'Current'",self.data.Current),
            ("'Longitude'",self.data.Longitude),
            ("'Latitude'",self.data.Latitude),
            ("'Elevation'",self.data.Elevation),
        ]

        missing_list = []
        for val in entries_list:
            if not val[1]():
                missing_list.append(val[0])
        if (missing_list):
            missing = ", ".join(missing_list).strip()
            self.logger.log_warning(f"Could not parse weather data. The entries: {missing} are missing.")
            return False
        return True

    def parse_weather_data(self):
        if (not self.is_valid_data()):
            return None

        parsed_data = {
            "latitute": self.data.Latitude(),
            "longitude": self.data.Longitude(),
            "elevation": self.data.Elevation(),
            "current_weather": {
                "time": {
                    "start": self.data.Current().Time(),
                    "end": self.data.Current().TimeEnd()
                },
                "temperature": self.data.Current().Variables(0).Value(),
                "relative_humidity": self.data.Current().Variables(1).Value(),
                "weather_code": self.data.Current().Variables(2).Value(),
                "wind_speed": self.data.Current().Variables(3).Value()
            },
            "hourly_weather": {
                "time": {
                    "start": self.data.Hourly().Time(),
                    "end": self.data.Hourly().TimeEnd()
                },
                "temperature": self.data.Hourly().Variables(0).Value(),
                "relative_humidity": self.data.Hourly().Variables(1).Value(),
                "weather_code": self.data.Hourly().Variables(2).Value(),
                "wind_speed": self.data.Hourly().Variables(3).Value()
            }
        }

        return parsed_data
