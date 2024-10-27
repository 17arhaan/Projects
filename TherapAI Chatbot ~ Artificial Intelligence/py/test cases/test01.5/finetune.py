import openai
import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('OPENAI_KEY')
openai.api_key = TOKEN

response = openai.File.create(
    file=open("dataset.jsonl"),
    purpose='fine-tune'
)

fine_tune_response = openai.FineTune.create(
    training_file=response['ftjob-2YV5sGhDYE9GKcoqHIJKQPhP'],
    model="gpt-3.5-turbo"  
)

print(f"Fine-tuning started: {fine_tune_response['id']}")