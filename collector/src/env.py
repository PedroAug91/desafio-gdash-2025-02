import os

required_env_vars = [
    # "RABBITMQ_DEFAULT_USER", 
    # "RABBITMQ_DEFAULT_PASS",
    # "RABBITMQ_PORT",
    # "RABBITMQ_HOST",
    "RABBITMQ_URL",
    "RABBITMQ_QUEUE",
]

def check_for_env_vars():
    missing_list = []
    for var in required_env_vars:
        if os.environ.get(var) is None:
            missing_list.append(var)

    if (missing_list):
        missing = ", ".join(missing_list)
        raise EnvironmentError(f"Missing the following env vars: {missing.rstrip()}")

check_for_env_vars()

# RABBITMQ_DEFAULT_USER = os.environ["RABBITMQ_DEFAULT_USER"]
# RABBITMQ_DEFAULT_PASS = os.environ["RABBITMQ_DEFAULT_PASS"]
# RABBITMQ_PORT = os.environ["RABBITMQ_PORT"]
# RABBITMQ_HOST = os.environ["RABBITMQ_HOST"]
RABBITMQ_URL = os.environ["RABBITMQ_URL"]
RABBITMQ_QUEUE = os.environ["RABBITMQ_QUEUE"]
WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"
WEATHER_API_PARAMS = {
    "latitude": -5.795,
    "longitude": -35.2094,
    "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "weather_code"],
    "current": ["temperature_2m", "relative_humidity_2m", "weather_code", "wind_speed_10m"],
}

