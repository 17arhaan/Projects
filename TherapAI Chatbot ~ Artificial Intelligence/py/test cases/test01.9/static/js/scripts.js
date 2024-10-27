document.getElementById('chat-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value;

    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });

    const result = await response.json();
    appendMessage('user', message);
    appendMessage('assistant', result.response);

    chatInput.value = '';
});

document.getElementById('end-chat').addEventListener('click', async () => {
    const response = await fetch('/end_chat', {
        method: 'POST'
    });

    const result = await response.json();

    if (result.success) {
        document.getElementById('chat-box').innerHTML = '';
        appendMessage('system', 'Chat has ended.');
    }
});

function appendMessage(role, content) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${role}`;
    messageElement.textContent = content;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
