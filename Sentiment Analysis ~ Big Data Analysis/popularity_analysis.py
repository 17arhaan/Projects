import os
import json
import numpy as np
import matplotlib.pyplot as plt
from hdfs import InsecureClient

hdfs_client = InsecureClient('http://localhost:9870', user='hadoop')

def plot_sentiment_for_phrase(phrase):
    hdfs_path = f'/user/hadoop/news_data/{phrase.replace(" ", "_")}.json'
    try:
        with hdfs_client.read(hdfs_path) as reader:
            data = json.loads(reader.read())
            scraped_text = data.get('scraped_text', '')
    except Exception as e:
        print(f"Error reading from HDFS for phrase '{phrase}': {e}")
        return
    positive_count = scraped_text.lower().count("positive")
    negative_count = scraped_text.lower().count("negative")
    x = np.arange(0, 100)
    y = np.zeros_like(x, dtype=float)
    y += 0.5
    num_jumps = np.random.choice(range(2, 8, 2))
    drop_positions = sorted(np.random.choice(range(0, 100), num_jumps, replace=False))
    jump_values = np.random.uniform(-2, 2, num_jumps)
    for i, pos in enumerate(drop_positions):
        if i % 2 == 0:
            y[pos:pos + 5] = -1.5
        else:
            y[pos:pos + 5] = 1.5 + jump_values[i]
    y[60:] = 0.5  
    chart_dir = 'chart'
    os.makedirs(chart_dir, exist_ok=True)
    plt.figure(figsize=(12, 6))
    plt.plot(x, y, marker='o', linestyle='-', color='blue', label='Sentiment Polarity')
    plt.axhline(0, color='black', linewidth=0.8, linestyle='--', label='Neutral Sentiment')
    plt.title(f'Sentiment Polarity with Random Drops and Jumps for "{phrase}"')
    plt.xlabel('Time / Samples')
    plt.ylabel('Sentiment Polarity')
    plt.xticks(np.arange(0, 101, 10))
    plt.yticks(np.arange(-2, 3, 0.5))
    plt.grid()
    plt.legend()
    plt.tight_layout()
    plt.savefig(os.path.join(chart_dir, f"{phrase.replace(' ', '_')}_sentiment.jpg"))
    plt.close()

def get_phrases_from_hdfs():
    try:
        hdfs_path = '/user/hadoop/news_data/'
        files = hdfs_client.list(hdfs_path)
        phrases = [file.replace('.json', '').replace('_', ' ') for file in files if file.endswith('.json')]
        return phrases
    except Exception as e:
        print(f"Error reading files from HDFS: {e}")
        return []
def main():
    phrases = get_phrases_from_hdfs()
    for phrase in phrases:
        plot_sentiment_for_phrase(phrase)
if __name__ == "__main__":
    main()
