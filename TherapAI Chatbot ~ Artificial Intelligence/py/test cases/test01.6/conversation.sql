-- create_conversations_table.sql

CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50),
    content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(50)
);
