import json
import os

class LocalFileUtils:
    def __init__(self, base_dir='./news_articles/'):
        self.base_dir = base_dir
        os.makedirs(self.base_dir, exist_ok=True)
    def write_to_file(self, filename, data):
        full_path = os.path.join(self.base_dir, filename)
        with open(full_path, 'w', encoding='utf-8') as writer:
            json.dump(data, writer)
    def read_from_file(self, filename):
        full_path = os.path.join(self.base_dir, filename)
        if not os.path.exists(full_path):
            return {}
        with open(full_path, 'r', encoding='utf-8') as reader:
            return json.load(reader)
    def append_to_file(self, filename, data):
        full_path = os.path.join(self.base_dir, filename)        
        if not os.path.exists(full_path):
            self.write_to_file(filename, {})
        existing_data = self.read_from_file(filename)
        existing_data.update(data)
        self.write_to_file(filename, existing_data)
