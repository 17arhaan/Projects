from flask import Flask, request, jsonify, render_template
import openai
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

TOKEN = os.getenv('OPENAI_KEY')
openai.api_key = TOKEN

# File to store conversation history
CONVERSATION_FILE = "conversation_history.txt"

def load_conversation_history():
    messages = []
    if os.path.exists(CONVERSATION_FILE):
        with open(CONVERSATION_FILE, "r") as file:
            for line in file:
                role, content = line.strip().split(":", 1)
                messages.append({"role": role, "content": content})
    return messages

def save_conversation_history(messages):
    with open(CONVERSATION_FILE, "w") as file:
        for message in messages:
            file.write(f"{message['role']}:{message['content']}\n")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/history', methods=['GET'])
def history():
    messages = load_conversation_history()
    return jsonify({"messages": messages})

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')
    
    messages = load_conversation_history()
    if not messages:
        messages.append({"role": "system", "content": "You are a helpful Therapist."})

    messages.append({"role": "user", "content": user_input})
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages
    )
    
    assistant_response = response.choices[0].message['content']
    
    messages.append({"role": "assistant", "content": assistant_response})
    
    save_conversation_history(messages)
    
    return jsonify({"response": assistant_response})

if __name__ == '__main__':
    app.run(debug=True)
