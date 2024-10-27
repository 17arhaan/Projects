// server/app.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Resolve __dirname since it's not available in ES modules by default
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

const apiKey = 'sk-proj-kbVEeeQwBdyySFCtpfGJT3BlbkFJwKktNymU9B4SM9MUGxSx'; // Replace with your OpenAI API key
const endpoint = 'https://api.openai.com/v1/engines/davinci/completions'; // Using the general davinci engine

app.post('/getTherapAIResponse', async (req, res) => {
    const { message } = req.body;
    const requestBody = {
        prompt: message,
        max_tokens: 50
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Network response was not ok: ' + errorText);
        }

        const data = await response.json();
        res.json({ response: data.choices[0].text });
    } catch (error) {
        console.error('Error fetching data from OpenAI:', error.message);
        res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
    }
});

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
