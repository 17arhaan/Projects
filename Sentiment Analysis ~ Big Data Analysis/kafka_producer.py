from confluent_kafka import Producer
import json

class NewsProducer:
    def __init__(self, bootstrap_servers='localhost:9092'):
        self.producer = Producer({'bootstrap.servers': bootstrap_servers})
    def delivery_report(self, err, msg):
        if err is not None:
            print(f'Message delivery failed: {err}')
        else:
            print(f'Message delivered to {msg.topic()} [{msg.partition()}]')
    def send_message(self, topic, message):
        try:
            self.producer.produce(topic, json.dumps(message).encode('utf-8'), callback=self.delivery_report)
            self.producer.flush()
        except Exception as e:
            print(f"Error sending message to Kafka: {e}")