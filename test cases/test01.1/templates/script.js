document.addEventListener('DOMContentLoaded', (event) => {
    loadConversationHistory();
});

async function loadConversationHistory() {
    const response = await fetch('/history');
    const data = await response.json();
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = '';
    data.messages.forEach(message => {
        const role = message.role === 'user' ? 'You' : 'Therapist';
        chatBox.innerHTML += `<div class="chat-message"><strong>${role}:</strong> ${message.content}</div>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    if (message.trim() === '') return;

    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML += `<div class="chat-message"><strong>You:</strong> ${message}</div>`;

    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
    });
    const data = await response.json();
    chatBox.innerHTML += `<div class="chat-message"><strong>Therapist:</strong> ${data.response}</div>`;

    messageInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
}