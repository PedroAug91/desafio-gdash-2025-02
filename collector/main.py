import pika
import schedule
from time import sleep

from Collector import Collector
from Logger import Logger
from MessageBroker import MessageBroker
from WeatherAPI import WeatherAPI
import env

def main():
    print("Attached to Python Container")
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": -5.795,
        "longitude": -35.2094,
        "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "weather_code"],
        "current": ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"],
    }
    weather_api = WeatherAPI(url, params, Logger("WeatherAPI"))

    pika_url = pika.URLParameters(env.RABBITMQ_URL)
    message_broker = MessageBroker(pika_url, Logger("MessageBroker"))
    collector = Collector(weather_api, message_broker)
    schedule.every(30).seconds.do(collector.collect_and_send)

    while True:
        sleep(1)
        schedule.run_pending()


if (__name__ == "__main__"):
    main()
