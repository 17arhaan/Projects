// const express = require('express');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const path = require('path');
// const app = express();
// const port = 3000; // Choose a port for your server

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // API Key for OpenAI - replace with your actual API key
// const apiKey = 'sk-proj-kbVEeeQwBdyySFCtpfGJT3BlbkFJwKktNymU9B4SM9MUGxSx';

// // Function to interact with OpenAI API
// async function askQuestion(question) {
//     try {
//         const response = await axios.post('https://api.openai.com/v1/completions', {
//             prompt: `User: ${question}\nTherapAI:`,
//             max_tokens: 150
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${apiKey}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         const aiResponse = response.data.choices[0].text.trim();
//         return aiResponse;
//     } catch (error) {
//         console.error('Error querying OpenAI API:', error);
//         return 'Apologies, I couldn\'t understand that.';
//     }
// }

// // Endpoint to handle incoming messages
// app.post('/message', async (req, res) => {
//     const { message } = req.body;

//     if (message.toLowerCase().includes('goodbye')) {
//         res.json({ message: 'Goodbye!' });
//         return;
//     }

//     const aiResponse = await askQuestion(message);
//     res.json({ message: aiResponse });
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

// const express = require('express');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const path = require('path');

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Endpoint to handle AI responses
// app.post('/ask-therapai', async (req, res) => {
//   try {
//     // Prompt from the user input
//     const { userMessage } = req.body;

//     // Your OpenAI API key
//     const apiKey = 'Bearer sk-proj-kbVEeeQwBdyySFCtpfGJT3BlbkFJwKktNymU9B4SM9MUGxSx';

//     // API endpoint
//     const apiUrl = 'https://api.openai.com/v1/completions';

//     // Request data
//     const requestData = {
//       prompt: `User: ${userMessage}\nTherapAI:`,
//       max_tokens: 150
//     };

//     // Axios request configuration
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': apiKey
//       }
//     };

//     // Make POST request to OpenAI API
//     const response = await axios.post(apiUrl, requestData, config);

//     // Return response from OpenAI to the client
//     res.json(response.data);
//   } catch (error) {
//     // Handle errors
//     console.error('Error querying OpenAI API:', error.message);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Route to serve HTML interface
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Handle all other GET requests with a 404 response
// app.get('*', (req, res) => {
//   res.status(404).send('404 - Not Found');
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/api/message", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: userMessage,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`
        }
      }
    );

    const assistantMessage = response.data.choices[0].text.trim();
    res.json({ reply: assistantMessage });
  } catch (error) {
    console.error("Error querying OpenAI API:", error);
    res.status(500).json({ error: "Error querying OpenAI API" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
