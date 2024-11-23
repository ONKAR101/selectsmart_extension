
    const chatBody = document.getElementById("chat-body");
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");

    // Bot Responses
    const botReplies = {
      "hi": "Hello! How can I assist you today?",
      "how are you": "I'm just a bot, but I'm here to help you!",
      "bye": "Goodbye! Have a great day!",
      "default": "I'm sorry, I didn't understand that. Could you please rephrase?"
    };

    // Send message to chatbot
    const sendMessage = () => {
      const userInput = chatInput.value.trim();
      if (userInput) {
        addMessage(userInput, "user-message");
        generateBotResponse(userInput.toLowerCase());
        chatInput.value = "";
      }
    };

    // Add message to chat body
    const addMessage = (text, className) => {
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${className}`;
      messageDiv.innerText = text;
      chatBody.appendChild(messageDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    };

    // Generate bot response
    const generateBotResponse = (input) => {
      const botReply = botReplies[input] || botReplies["default"];
      setTimeout(() => {
        addMessage(botReply, "bot-message");
      }, 500);
    };

    // Send message on button click
    sendButton.addEventListener("click", sendMessage);

    // Send message on 'Enter' key press
    chatInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
