from confluent_kafka import Consumer, KafkaError
import json
import time
from sentiment_analyzer import SentimentAnalyzer
from local_file_utils import LocalFileUtils

class NewsConsumer:
    def __init__(self, topic, group_id, bootstrap_servers='localhost:9092'):
        self.consumer = Consumer({
            'bootstrap.servers': bootstrap_servers,
            'group.id': group_id,
            'auto.offset.reset': 'earliest'
        })
        self.consumer.subscribe([topic])
        self.sentiment_analyzer = SentimentAnalyzer()
        self.file_utils = LocalFileUtils()
    def consume_messages(self, time_limit, article_limit):
        start_time = time.time()
        article_count = 0
        try:
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        continue
                    else:
                        print(f"Consumer error: {msg.error()}")
                        break
                try:
                    message = json.loads(msg.value().decode('utf-8'))
                    phrase = message['phrase']
                    scraped_text = message['scraped_text']
                    articles = message.get('articles', [])
                    if articles:
                        print(f"Fetched articles for phrase '{phrase}':")
                        for article in articles:
                            print(f" - Title: {article['title']}, URL: {article['url']}")
                    else:
                        print(f"No articles found for phrase '{phrase}'.")
                    polarity = self.sentiment_analyzer.analyze_sentiment(scraped_text)
                    sentiment = self.sentiment_analyzer.categorize_sentiment(polarity)
                    result = {
                        'phrase': phrase,
                        'scraped_text': scraped_text,
                        'sentiment': sentiment,
                        'polarity': polarity,
                        'articles': articles
                    }
                    self.file_utils.append_to_file('articles.json', {phrase: result})
                    print(f"Attempting to write to articles.json...")
                    current_data = self.file_utils.read_from_file('articles.json')
                    print(f"Current content of articles.json: {current_data}")

                    print(f"Processed and stored result for phrase: {phrase}")
                    print(f"Sentiment: {sentiment}, Polarity: {polarity}")
                    article_count += 1
                    if article_count >= article_limit or (time.time() - start_time) >= time_limit:
                        print("Stopping consumption based on limits reached.")
                        break
                except json.JSONDecodeError:
                    print(f"Error decoding message: {msg.value().decode('utf-8')}")
                except Exception as e:
                    print(f"Error processing message: {e}")
        except KeyboardInterrupt:
            pass
        finally:
            self.consumer.close()
