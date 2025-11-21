import pika
import json

class MessageBroker:
    def __init__(self, credentials, connection_config) -> None:
        self.credentials = credentials
        self.config = connection_config

    def start_connection(self):
        self.connection = pika.BlockingConnection(self.credentials)

        if (not self.connection):
            return False

        self.channel = self.connection.channel()

    def define_queue(self, queue_name):
        self.queue = queue_name

    def send_data(self, data):
        self.channel.queue_declare(self.queue)
        self.channel.basic_publish(
            exchange="",
            routing_key=self.queue,
            body=json.dumps(data)
        )


