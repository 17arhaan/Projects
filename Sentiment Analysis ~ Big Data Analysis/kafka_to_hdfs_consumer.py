from kafka_consumer import NewsConsumer
from pyspark import SparkConf, SparkContext
import os

def save_to_hdfs(data, hdfs_path):
    sc = SparkContext.getOrCreate()
    rdd = sc.parallelize([data])
    rdd.saveAsTextFile(hdfs_path)

def consume_and_store_in_hdfs():
    consumer = NewsConsumer('news_articles', 'hdfs_group')
    hdfs_path = 'hdfs:///user/news_data/'
    for message in consumer.consume_messages():
        phrase = message['phrase']
        scraped_text = message['scraped_text']
        print(f"Saving to HDFS: {phrase}")
        save_to_hdfs(scraped_text, hdfs_path + phrase)
