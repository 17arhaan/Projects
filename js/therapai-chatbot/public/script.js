document.addEventListener("DOMContentLoaded", () => {
    const messagesContainer = document.getElementById("messages");
  
    function appendMessage(text, sender) {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.classList.add(sender === "user" ? "user-message" : "assistant-message");
      messageElement.innerText = text;
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  
    async function sendMessage() {
      const userInput = document.getElementById("user-input");
      const message = userInput.value.trim();
      if (!message) return;
  
      appendMessage(message, "user");
      userInput.value = "";
  
      try {
        const response = await fetch("/api/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: message })
        });
  
        if (!response.ok) {
          appendMessage("There was an error processing your request.", "assistant");
          return;
        }
  
        const data = await response.json();
        appendMessage(data.reply, "assistant");
      } catch (error) {
        appendMessage("There was an error processing your request.", "assistant");
        console.error("Error querying OpenAI API:", error);
      }
    }
  
    document.getElementById("user-input").addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  
    document.querySelector("button").addEventListener("click", sendMessage);
  });
  