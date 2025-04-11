import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../styles/ChatButton.css';

function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [socket, setSocket] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUserId(userInfo._id);
      setUserName(userInfo.name);
    } else {
      console.error('❌ Không tìm thấy thông tin người dùng trong localStorage');
    }
  }, []);

  useEffect(() => {
    // Kết nối Socket.IO thay vì WebSocket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO connection established:', newSocket.id);
    });

    // Lắng nghe sự kiện receiveMessage từ server
    newSocket.on('receiveMessage', (data) => {
      // Chỉ hiển thị tin nhắn nếu là từ admin hoặc gửi đến user này
      if (data.sender === 'admin' && data.userId === userId) {
        setMessages((prev) => [
          ...prev,
          { 
            text: data.text, 
            timestamp: data.timestamp, 
            seen: false,
            isAdmin: true
          }
        ]);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      setTimeout(() => {
        newSocket.connect();
      }, 3000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const sendMessage = () => {
    if (socket && socket.connected && input.trim() && userId) {
      const newMessage = {
        text: input,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'user',
        userId: userId, // ID của người dùng hiện tại
        userName: userName // Thêm tên người dùng để admin dễ nhận biết
      };

      // Gửi tin nhắn qua Socket.IO
      socket.emit('sendMessage', newMessage);

      // Thêm tin nhắn vào state local
      setMessages((prev) => [
        ...prev,
        { 
          text: input, 
          timestamp: newMessage.timestamp, 
          seen: true,
          isAdmin: false 
        }
      ]);

      setInput('');
    } else if (!socket || !socket.connected) {
      console.log('❌ Socket.IO chưa kết nối hoặc đã bị đóng.');
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
              <div key={index} className={msg.isAdmin ? 'admin-msg' : 'user-msg'}>
                <p>{msg.text}</p>
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