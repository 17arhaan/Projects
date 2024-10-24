import os
import subprocess
import time
from hadoop_utils import HadoopUtils
def run_command(command, check_output=False):
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    output, error = process.communicate()
    if process.returncode != 0:
        print(f"Error executing command: {command}")
        print(f"Error message: {error.decode('utf-8')}")
        return False if not check_output else (False, error.decode('utf-8'))
    return True if not check_output else (True, output.decode('utf-8'))

def start_hadoop():
    print("Starting Hadoop...")
    if run_command('start-dfs.sh') and run_command('start-yarn.sh'):
        print("Hadoop started successfully.")
    else:
        print("Failed to start Hadoop. Please check your Hadoop configuration.")

def start_kafka():
    print("Starting ZooKeeper...")
    if not run_command('zookeeper-server-start.sh -daemon $KAFKA_HOME/config/zookeeper.properties'):
        print("Failed to start ZooKeeper. Kafka startup aborted.")
        return False
    print("Waiting for ZooKeeper to start...")
    time.sleep(10)
    print("Starting Kafka...")
    if not run_command('kafka-server-start.sh -daemon $KAFKA_HOME/config/server.properties'):
        print("Failed to start Kafka. Please check your Kafka configuration.")
        return False
    print("Waiting for Kafka to start...")
    time.sleep(20)
    for _ in range(5):
        success, output = run_command('kafka-topics.sh --list --bootstrap-server localhost:9092', check_output=True)
        if success:
            print("Kafka started successfully.")
            return True
        time.sleep(5)
    print("Failed to verify Kafka startup. Please check Kafka logs.")
    return False

def create_hdfs_directories():
    print("Creating HDFS directories...")
    commands = [
        'hdfs dfs -mkdir -p /user/$USER',
        'hdfs dfs -mkdir -p /user/$USER/news_data',
        'hdfs dfs -mkdir -p /user/$USER/keywords',
        'hdfs dfs -chmod -R 755 /user/$USER'
    ]
    for cmd in commands:
        if not run_command(cmd):
            print(f"Failed to execute HDFS command: {cmd}")
            return False
    print("HDFS directories created successfully.")
    return True

def initialize_keywords():
    print("Initializing keywords in HDFS...")
    hadoop_utils = HadoopUtils(hdfs_url=f'http://localhost:9870', user=os.environ['USER'])
    initial_keywords = {
        "climate change": True,
        "artificial intelligence": True,
        "renewable energy": True,
        "global economy": True,
        "public health": True
    }
    try:
        hadoop_utils.write_to_hdfs(f'/user/{os.environ["USER"]}/keywords/sentiment_keywords.json', initial_keywords)
        print("Keywords initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize keywords: {str(e)}")

def create_kafka_topic():
    print("Creating Kafka topic 'news_articles'...")
    success, output = run_command('kafka-topics.sh --create --topic news_articles --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 --if-not-exists', check_output=True)
    if success:
        print("Kafka topic created successfully.")
        return True
    elif "already exists" in output:
        print("Kafka topic 'news_articles' already exists.")
        return True
    else:
        print("Failed to create Kafka topic. Please check your Kafka configuration.")
        return False

def main():
    start_hadoop()
    if not start_kafka():
        print("Kafka startup failed. Exiting setup.")
        return
    if create_hdfs_directories():
        initialize_keywords()
    if create_kafka_topic():
        print("Setup complete. The system is ready to run.")
    else:
        print("Setup incomplete due to Kafka topic creation failure.")
if __name__ == "__main__":
    main()
