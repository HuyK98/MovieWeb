import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../styles/Chat.css';

const socket = io('http://localhost:5000');

function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        //lọc chỉ lấy ng dùng có role là user
        const filteredUsers = data.filter(user => user.role === 'user');
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prev) => ({
        ...prev,
        [data.userId]: [...(prev[data.userId] || []), data],
      }));
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    if (!messages[user._id]) {
      setMessages((prev) => ({ ...prev, [user._id]: [] }));
    }
  };

  const sendMessage = () => {
    if (input.trim() && selectedUser) {
      const newMessage = {
        text: input,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'admin',
        userId: selectedUser._id,
      };

      // Gửi tin nhắn qua Socket.IO, không cập nhật state ở đây
      socket.emit('sendMessage', newMessage);

      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const filteredMessages = selectedUser ? messages[selectedUser._id] || [] : [];

  return (
    <div className="chat-container-admin">
      <button
        className="chat-toggle-btn-admin"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬 Chat
      </button>

      {isOpen && (
        <div className="chat-popup-admin">
          <div className="chat-sidebar-admin">
            <h4>Danh sách người dùng</h4>
            <ul>
              {users.map((user) => (
                <li
                  key={user._id}
                  className={selectedUser?._id === user._id ? 'active-user' : ''}
                  onClick={() => handleUserClick(user)}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="chat-main-admin">
            {selectedUser ? (
              <>
                <div className="chat-header-admin">
                  <h3>Đang chat với {selectedUser.name}</h3>
                </div>
                <div className="chat-messages-admin">
                  {filteredMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={msg.sender === 'admin' ? 'admin-msg' : 'user-msg'}
                    >
                      <p>{msg.text}</p>
                      <span className="timestamp">{msg.timestamp}</span>
                    </div>
                  ))}
                </div>
                <div className="chat-input-admin">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                  />
                  <button onClick={sendMessage}>Gửi</button>
                </div>
              </>
            ) : (
              <div className="chat-placeholder-admin">
                <p>Chọn một người dùng để bắt đầu chat</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;