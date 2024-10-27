document.addEventListener('DOMContentLoaded', async () => {
    const historyContainer = document.getElementById('history-container');

    const response = await fetch('/history', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();

    if (response.ok) {
        data.messages.forEach(message => {
            historyContainer.innerHTML += `<p><strong>${message.username}:</strong> ${message.content} <em>(${message.timestamp})</em></p>`;
        });
    } else {
        historyContainer.innerHTML = `<p>${data.error}</p>`;
    }
});
