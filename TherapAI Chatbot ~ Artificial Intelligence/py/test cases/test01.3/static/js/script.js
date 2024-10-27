document.addEventListener('DOMContentLoaded', () => {
    const conversation = document.getElementById('conversation');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message');
    const usernameInput = document.getElementById('username');
    const clock = document.getElementById('clock');
    const gifOverlay = document.getElementById('gif-overlay');
    const container = document.querySelector('.container');

    function updateClock() {
        const now = new Date();
        const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        clock.innerText = now.toLocaleString('en-GB', options).replace(',', ' |');
    }

    function appendMessage(role, content, username) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', role);
        const usernameText = username ? `${username} (${role})` : role;
        messageDiv.innerHTML = `<span>${usernameText}:</span> ${content}`;
        conversation.appendChild(messageDiv);
        conversation.scrollTop = conversation.scrollHeight;
    }

    async function loadHistory() {
        const response = await fetch('/history');
        const data = await response.json();
        data.messages.forEach(msg => {
            appendMessage(msg.role, msg.content, msg.username);
        });
    }

    async function sendMessage(userInput, username) {
        appendMessage('user', userInput, username);
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userInput, username: username })
            });
            const data = await response.json();
            if (data.response) {
                appendMessage('assistant', data.response, 'TherapAI');
            } else if (data.error) {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = messageInput.value;
        const username = usernameInput.value || 'anonymous';
        sendMessage(userInput, username);
        messageInput.value = '';
    });

    setInterval(updateClock, 1000);
    updateClock();
    loadHistory();

    setTimeout(() => {
        gifOverlay.style.display = 'none';
        container.style.display = 'block';
    }, 3000);
});