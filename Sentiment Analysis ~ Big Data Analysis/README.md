
<div> 
  <a href="https://github.com/17Arhaan" target="_blank"><img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" target="_blank"></a>
</div>
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

<h3 align="center">Statistics</h3>
<div align="center">
  <a href="https://github.com/17Arhaan">
    <img align="center" src="http://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=17Arhaan&theme=2077" height="180em" />
    <img align="center" src="http://github-profile-summary-cards.vercel.app/api/cards/stats?username=17Arhaan&theme=2077" height="180em" />
    <br>
    <img align="center" src="http://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=17Arhaan&theme=2077" height="180em" />
    <img align="center" src="http://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=17Arhaan&theme=2077" height="180em" />
  </a>
</div>
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 📈 Contribution Graph
![Github Activity Graph](https://github-readme-activity-graph.vercel.app/graph?username=17Arhaan&theme=react)

## Overview

This Python-based script fetches data from multiple APIs (NewsAPI, GDELT, Wikipedia) based on a given phrase, processes it, and sends it to a Kafka message queue.
The goal is to analyze news articles, global trends, and Wikipedia summaries efficiently, within a set time limit, to avoid long processing times.

## Features

- **Multi-API Integration**: Fetch data from NewsAPI, GDELT, and Wikipedia based on user input.
- **Time-limited Fetching**: Limits API calls to 3 minutes or 5 pages of results, ensuring efficient processing.
- **Kafka Integration**: Sends combined data to a Kafka queue for real-time streaming of data after webscraping.
- **Customizable Search**: Can be modified to adjust the time limits or page size.
- **Hadoop Usage**: Hadoop is used for storing webscraped data and cross-referencing new searches with already searched data.

## Requirements

- Python 3.8 or above
- Kafka
- Hadoop
- NewsAPI Client
- GDELT API
- Wikipedia API
- Requests

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/17Arhaan/BDA_Sentiment_Analysis
   cd BDA_Sentiment_Analysis
