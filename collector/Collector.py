from MessageBroker import MessageBroker
from WeatherAPI import WeatherAPI

class Collector:
    def __init__(self, weather_api: WeatherAPI, message_broker: MessageBroker) -> None:
        self.weather_api = weather_api
        self.message_broker = message_broker
        self.data = None

    def has_weather_data(self):
        if (self.data is None):
            return False
        return True

    def collect_weather_data(self):
        self.data = self.weather_api.get_parsed_weather_data()

    def send_weather_data(self):
        self.message_broker.send_data(self.data)

    def collect_and_send(self):
        self.collect_weather_data()
        if (not self.has_weather_data()):
            raise Exception("Missing weather data")
        self.send_weather_data()
