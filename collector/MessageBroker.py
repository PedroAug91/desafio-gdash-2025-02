import pika
import json

class MessageBroker:
    def __init__(self, params: pika.URLParameters) -> None:
        self.params = params
        self.start_connection()
        self.define_queue("weather_data")

    def start_connection(self):
        self.connection = pika.BlockingConnection(self.params)

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


