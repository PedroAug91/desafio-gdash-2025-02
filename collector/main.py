import pika
import schedule
from time import sleep

from MessageBroker import MessageBroker
from WeatherAPI import WeatherAPI
import env

def main():
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": -5.795,
        "longitude": -35.2094,
        "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "weather_code"],
        "current": ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"],
    }

    pika_url = pika.URLParameters(env.RABBITMQ_URL)
    message_broker = MessageBroker(pika_url)
    api = WeatherAPI(url, params, message_broker)
    schedule.every(30).seconds.do(api.send_weather_data)
    # schedule.every(1).minute.do(api.send_weather_data)

    while True:
        sleep(5)
        schedule.run_pending()

if (__name__ == "__main__"):
    main()
