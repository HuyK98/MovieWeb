import React, { useState } from "react";
import "../styles/Chatbot.css";
import { getChatbotResponse } from "../../../movie-booking-backend/routes/chatbotLogic";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      const userMessage = input;
      const chatbotResponse = getChatbotResponse(userMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `You: ${userMessage}`, isUser: true },
        { text: `Bot: ${chatbotResponse}`, isUser: false },
      ]);

      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <span role="img" aria-label="chat">
          🤖
        </span>
      </button>

      {isOpen && (
        <div className="chatbot-popup">
          <div className="chatbot-header">
            <h3>Chatbot</h3>
            <button
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.isUser ? "chatbot-user-msg" : "chatbot-bot-msg"}
              >
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about movies..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
