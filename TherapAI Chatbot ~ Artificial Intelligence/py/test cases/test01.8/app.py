from flask import Flask, request, jsonify, render_template, redirect, url_for
import sqlite3
import hashlib

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('therapy_chatbot.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE username = ? AND password = ?', (username, hashed_password)).fetchone()
    conn.close()
    
    if user:
        return redirect(url_for('chat'))
    else:
        return 'Invalid credentials', 401

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    password = request.form['password']
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return 'Username already exists', 400
    conn.close()
    
    return redirect(url_for('index'))

@app.route('/chat')
def chat():
    return 'Welcome to the therapy chatbot!'

if __name__ == '__main__':
    app.run(debug=True)
