from flask import Flask, request, jsonify, render_template, session
import openai
import os
from dotenv import load_dotenv
from datetime import datetime
import logging

app = Flask(__name__)
app.secret_key = os.urandom(24)  # For session management
load_dotenv()

TOKEN = os.getenv('OPENAI_KEY')
openai.api_key = TOKEN

# Replace with your fine-tuned model ID
FINE_TUNED_MODEL = "ft:gpt-3.5-turbo-0125:therapai::9i2mCUVf"

CONVERSATION_FILE = "conversation_history.txt"

# Set up logging
logging.basicConfig(level=logging.INFO)

def load_conversation_history():
    messages = []
    if os.path.exists(CONVERSATION_FILE):
        with open(CONVERSATION_FILE, "r") as file:
            for line in file:
                try:
                    role, content, timestamp, username = line.strip().split(":", 3)
                    messages.append({"role": role, "content": content, "timestamp": timestamp, "username": username})
                except ValueError:
                    pass
    return messages

def save_conversation_history(messages):
    with open(CONVERSATION_FILE, "w") as file:
        for message in messages:
            file.write(f"{message['role']}:{message['content']}:{message['timestamp']}:{message['username']}\n")

def get_formatted_timestamp():
    return datetime.now().strftime("%d %b %Y | %H:%M")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat')
def chat_page():
    return render_template('chat.html')

@app.route('/history', methods=['GET'])
def history():
    messages = load_conversation_history()
    return jsonify({"messages": messages})

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_input = request.json.get('message')
        username = request.json.get('username', 'anonymous')

        if not user_input:
            return jsonify({"error": "Please provide a message."}), 400

        if 'messages' not in session:
            session['messages'] = [{"role": "system", "content": "You are a helpful Therapist.", "timestamp": get_formatted_timestamp(), "username": "system"}]

        messages = session['messages']
        timestamp = get_formatted_timestamp()
        messages.append({"role": "user", "content": user_input, "timestamp": timestamp, "username": username})

        response = openai.ChatCompletion.create(
            model=FINE_TUNED_MODEL,
            messages=[{"role": m["role"], "content": m["content"]} for m in messages if m['role'] in ['system', 'user', 'assistant']]
        )

        assistant_response = response.choices[0].message['content']

        messages.append({"role": "assistant", "content": assistant_response, "timestamp": get_formatted_timestamp(), "username": "assistant"})

        session['messages'] = messages
        save_conversation_history(messages)

        return jsonify({"response": assistant_response})

    except openai.error.OpenAIError as e:
        app.logger.error(f"OpenAI API Error: {str(e)}")
        return jsonify({"error": "OpenAI API encountered an error. Please try again later."}), 500
    except Exception as e:
        app.logger.error(f"Unexpected Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500

if __name__ == '__main__':
    app.run(debug=True)
