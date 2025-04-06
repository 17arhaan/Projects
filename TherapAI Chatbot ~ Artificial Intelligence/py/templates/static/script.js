document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const messageInput = document.getElementById('message-input');
    const usernameInput = document.getElementById('username-input');
    const chatBox = document.getElementById('chat-box');

    const message = messageInput.value;
    const username = usernameInput.value;

    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, username }),
    });

    const data = await response.json();

    if (response.ok) {
        chatBox.innerHTML += `<p><strong>${username}:</strong> ${message}</p>`;
        chatBox.innerHTML += `<p><strong>Therapist:</strong> ${data.response}</p>`;
        messageInput.value = '';
    } else {
        alert(data.error);
    }
});
