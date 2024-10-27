from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import openai
import os
from dotenv import load_dotenv
from datetime import datetime
import logging
import psycopg2

# Load environment variables
load_dotenv()

# Flask app setup
app = Flask(__name__)

# OpenAI API setup
TOKEN = os.getenv('OPENAI_KEY')
openai.api_key = TOKEN

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Conversation model
class Conversation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(50))
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    username = db.Column(db.String(50))

def get_formatted_timestamp():
    return datetime.now().strftime("%d %b %Y | %H:%M")

def create_table():
    conn = None
    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        cur = conn.cursor()
        with open('conversation.sql', 'r') as file:
            cur.execute(file.read())
        conn.commit()
        cur.close()
    except Exception as error:
        logger.error(f"Error creating table: {error}")
    finally:
        if conn is not None:
            conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat')
def chat_page():
    return render_template('chat.html')

@app.route('/history', methods=['GET'])
def history():
    messages = Conversation.query.order_by(Conversation.timestamp.asc()).all()
    messages_list = [
        {"role": msg.role, "content": msg.content, "timestamp": msg.timestamp.strftime("%d %b %Y | %H:%M"), "username": msg.username}
        for msg in messages
    ]
    return jsonify({"messages": messages_list})

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_input = request.json.get('message')
        username = request.json.get('username', 'anonymous')

        if not user_input:
            return jsonify({"error": "No input provided"}), 400

        # Load conversation history from the database
        messages = Conversation.query.order_by(Conversation.timestamp.asc()).all()
        if not messages:
            system_message = Conversation(role="system", content="You are a helpful Therapist.", timestamp=datetime.utcnow(), username="system")
            db.session.add(system_message)
            db.session.commit()

        timestamp = datetime.utcnow()
        user_message = Conversation(role="user", content=user_input, timestamp=timestamp, username=username)
        db.session.add(user_message)
        db.session.commit()

        # Retrieve the conversation history for OpenAI API
        conversation_history = [{"role": m.role, "content": m.content} for m in messages if m.role in ['system', 'user', 'assistant']]
        conversation_history.append({"role": "user", "content": user_input})

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=conversation_history
        )

        assistant_response = response.choices[0].message['content']

        assistant_message = Conversation(role="assistant", content=assistant_response, timestamp=datetime.utcnow(), username="assistant")
        db.session.add(assistant_message)
        db.session.commit()

        return jsonify({"response": assistant_response})

    except openai.error.OpenAIError as e:
        logger.error(f"OpenAI API Error: {str(e)}")
        return jsonify({"error": "There was an error with the OpenAI API"}), 500
    except Exception as e:
        logger.error(f"Unexpected Error: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == '__main__':
    with app.app_context():
        create_table()
        db.create_all()
    app.run(debug=True)
