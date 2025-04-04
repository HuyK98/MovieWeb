import React, { useState, useEffect } from 'react';
import '../styles/ChatButton.css';
import { useRef } from 'react';

function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onopen = () => console.log('✅ WebSocket connection established');

    ws.current.onmessage = (event) => {
      console.log('📩 Tin nhắn từ server:', event.data);
      setMessages((prev) => [...prev, { text: event.data, timestamp: new Date().toLocaleTimeString(), seen: false }]);
    };

    ws.current.onerror = (error) => console.error('❌ WebSocket error:', error);

    ws.current.onclose = () => console.log('❌ WebSocket closed');

    return () => {
      ws.current.close();
    };
  }, []);


  const sendMessage = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const messageToSend = `user: ${input}`;
      
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: messageToSend, timestamp: new Date().toLocaleTimeString(), seen: true }
      ]);
  
      ws.current.send(messageToSend);
      setInput('');
    } else {
      console.log('❌ WebSocket chưa kết nối hoặc đã bị đóng.');
    }
  };  

  const reconnectWebSocket = () => {
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      console.log("🔄 Đang thử kết nối lại WebSocket...");
      ws.current = new WebSocket('ws://localhost:8080');

      ws.current.onopen = () => console.log('✅ WebSocket reconnected');
      ws.current.onerror = (error) => console.error('❌ WebSocket error:', error);
      ws.current.onmessage = (event) => {
        setMessages((prev) => [
          ...prev,
          { text: event.data, timestamp: new Date().toLocaleTimeString(), seen: false },
        ]);
      };
      ws.current.onclose = () => {
        console.log('❌ WebSocket closed. Tự động thử kết nối lại sau 3 giây...');
        setTimeout(reconnectWebSocket, 3000);
      };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span role="img" aria-label="chat">💬</span>
      </button>

      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Chat với Admin</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.text && msg.text.startsWith('user:') ? 'user-msg' : 'admin-msg'}>
                <p>{msg.text ? msg.text.replace(/^user: /, '') : ''}</p>
                <span className="timestamp">{msg.timestamp}</span>
                {msg.seen && <span className="seen-status">Đã xem</span>}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatButton;