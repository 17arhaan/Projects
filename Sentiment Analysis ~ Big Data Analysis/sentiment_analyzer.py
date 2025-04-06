from textblob import TextBlob

class SentimentAnalyzer:
    def analyze_sentiment(self, text):
        try:
            blob = TextBlob(text)
            return blob.sentiment.polarity
        except Exception as e:
            print(f"Error in sentiment analysis: {e}")
            return 0
    def categorize_sentiment(self, polarity):
        if polarity > 0.001:
            return 'positive'
        elif polarity < -0.001:
            return 'negative'
        else :
            return 'neutral'