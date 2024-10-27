require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai= new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `You are a therapist AI. A user is talking to you. User: ${userMessage}\nTherapist:`,
      max_tokens: 150,
      n: 1,
      stop: ['\n'],
      temperature: 0.9,
    });

    const therapistReply = response.data.choices[0].text.trim();
    res.json({ reply: therapistReply });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
});

app.listen(3000, () => {
  console.log('TherapAI server is running on port 3000');
});
