import pika
import json
import env

from utils import Logger

class RabbitMQPublisher:
    def __init__(self, params: pika.URLParameters, logger: Logger) -> None:
        self.params = params
        self.logger = logger

    def create_connection(self):
        try:
            self.connection = pika.BlockingConnection(self.params)
            self.logger.log_info("Connected to RabbitMQ")
        except Exception as e:
            self.logger.log_error(f"Could not connect to RabbitMQ: {e}")
            raise e
        return self

    def connect(self):
        self.create_connection().create_channel().define_queue()
        return self

    def create_channel(self):
        try:
            self.channel = self.connection.channel()
            self.logger.log_info(f"Connected to channel {self.channel.channel_number}")
        except Exception as e:
            self.logger.log_error(f"Could not create channel: {e}")
            raise e

        return self

    def define_queue(self):
        self.queue = env.RABBITMQ_QUEUE
        return self

    def publish(self, data):
        self.channel.queue_declare(self.queue)
        try:
            self.channel.basic_publish(
                exchange="",
                routing_key=self.queue,
                body=json.dumps(data)
            )
            self.logger.log_info("Data sent to RabbitMQ")
        except Exception as e:
            self.logger.log_error(f"Could not send data to RabbitMQ {e}")
            raise e
