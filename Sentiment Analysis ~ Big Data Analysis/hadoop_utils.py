from hdfs import InsecureClient
import json
class HadoopUtils:
    def __init__(self, hdfs_url='http://localhost:9870', user=None):
        self.client = InsecureClient(hdfs_url, user=user)
    def write_to_hdfs(self, filename, data):
        with self.client.write(filename, encoding='utf-8') as writer:
            json.dump(data, writer)
    def read_from_hdfs(self, filename):
        with self.client.read(filename, encoding='utf-8') as reader:
            return json.load(reader)
    def append_to_hdfs(self, filename, data):
        existing_data = self.read_from_hdfs(filename)
        existing_data.update(data)
        self.write_to_hdfs(filename, existing_data)