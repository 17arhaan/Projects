document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
        window.location.href = '/chat';
    } else {
        displayErrorMessage('Invalid username or password.');
    }
});

function displayErrorMessage(message) {
    const errorMessageElement = document.getElementById('login-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
}
