import React, { useState, useEffect } from 'react';
import '../styles/Chat.css';

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080');
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      console.error('WebSocket URL:', websocket.url);
      console.error('WebSocket readyState:', websocket.readyState);
    };

    websocket.onmessage = (event) => {
      let message = event.data;
    
      // Kiểm tra nếu message là Blob, chuyển đổi thành chuỗi
      if (message instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          message = reader.result; // Chuyển đổi Blob thành chuỗi
          processMessage(message);
        };
        reader.readAsText(message);
      } else {
        processMessage(message);
      }
    };
    
    // Hàm xử lý tin nhắn
    const processMessage = (message) => {
      if (typeof message !== 'string') {
        message = String(message);
      }
    
      const timestamp = new Date().toLocaleTimeString();
    
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) => msg.text === message && msg.timestamp === timestamp
        );
    
        if (!isDuplicate) {
          // Chỉ thêm tin nhắn không phải từ admin
          if (!message.startsWith('admin:')) {
            return [
              ...prev,
              { text: message, timestamp, seen: false },
            ];
          }
        }
        return prev;
      });
    };

    websocket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
    };

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  const sendMessage = () => {
    if (ws && input.trim() && ws.readyState === WebSocket.OPEN) {
      const messageToSend = `admin: ${input}`;
      const newMessage = {
        text: messageToSend,
        timestamp: new Date().toLocaleTimeString(),
        seen: true,
      };
  
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      ws.send(messageToSend); // Gửi tin nhắn dưới dạng chuỗi
      setInput('');
    } else {
      console.log('WebSocket not connected. ReadyState:', ws?.readyState);
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
            <h3>Chat với User</h3>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.text && msg.text.startsWith('admin:') ? 'user-msg' : 'admin-msg'}>
                <p>{msg.text ? msg.text.replace(/^admin: /, '') : ''}</p>
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

export default Chat;