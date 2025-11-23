import pika
import json
from Logger import Logger
import env

class MessageBroker:
    def __init__(self, params: pika.URLParameters, logger: Logger) -> None:
        self.params = params
        self.logger = logger
        self.start_connection()
        self.define_queue(env.RABBITMQ_QUEUE)

    def start_connection(self):
        try:
            self.connection = pika.BlockingConnection(self.params)
        except Exception as e:
            self.logger.set_log_level("ERROR").log(f"Could not connect to RabbitMQ: {e}")
            raise e

        self.channel = self.connection.channel()
        self.logger.set_log_level("INFO").log(f"Connected to channel")

    def define_queue(self, queue_name):
        self.queue = queue_name

    def send_data(self, data):
        self.channel.queue_declare(self.queue)
        self.channel.basic_publish(
            exchange="",
            routing_key=self.queue,
            body=json.dumps(data)
        )
        self.logger.set_log_level("INFO").log("Data sent to RabbitMQ")
