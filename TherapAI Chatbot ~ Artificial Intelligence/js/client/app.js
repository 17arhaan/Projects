// client/app.js
document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    addMessageToChat(userMessage, 'user');

    userInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('http://localhost:3000/getTherapAIResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        addMessageToChat(data.response, 'bot');
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        addMessageToChat('Error: ' + error.message, 'bot');
    }
});

function addMessageToChat(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
}
