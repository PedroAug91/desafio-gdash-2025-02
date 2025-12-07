import pika
import schedule
from time import sleep

from collectors import OpenMeteoAPI
from parsers import OpenMeteoDataParser
from utils import Logger
from publishers import RabbitMQPublisher
import env

class WeatherDataService:
    def __init__(self, collector: OpenMeteoAPI, publisher: RabbitMQPublisher, logger: Logger) -> None:
        self.collector = collector
        self.publisher = publisher
        self.logger = logger
        self.data = None

    def get_data(self):
        try:
            self.data = self.collector.call_weather_api().parse_weather_data()
        except Exception:
            self.logger.log_error(f"Could not get parsed weather data from the collector.")

    def connect_to_broker(self):
        try:
            self.publisher.connect()
        except Exception:
            self.logger.log_error(f"Could not connect to broker.")

    def publish_data(self):
        self.get_data()
        if (not self.data):
            return

        try:
            self.publisher.publish(self.data)
        except Exception:
            self.logger.log_error(f"Could not publish data.")


def main():
    Logger("Application").log_info("Started the container")
    pika_url = pika.URLParameters(env.RABBITMQ_URL)
    publisher = RabbitMQPublisher(pika_url, Logger("Publisher"))
    parser = OpenMeteoDataParser(Logger("Data Parser"))
    collector = OpenMeteoAPI(env.WEATHER_API_URL, env.WEATHER_API_PARAMS, parser,Logger("Collector"))
    service = WeatherDataService(collector, publisher, Logger("Weather Service"))
    service.connect_to_broker()

    # schedule.every(30).seconds.do(service.publish_data)
    # schedule.every(1).minute.do(service.publish_data)
    schedule.every(1).hour.do(service.publish_data)


    while True:
        sleep(1)
        schedule.run_pending()


if (__name__ == "__main__"):
    main()
