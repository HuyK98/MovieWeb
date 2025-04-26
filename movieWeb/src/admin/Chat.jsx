import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaSmile, FaPaperclip, FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import '../styles/Chat.css';
import API_URL from '../api/config'; // Đường dẫn API của bạn

const socket = io('http://localhost:5000');

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm:ss dd/MM/yyyy'); // Định dạng giờ:phút:giây ngày/tháng/năm
    } catch (error) {
      console.error('Lỗi định dạng thời gian:', error);
      return 'Invalid date';
    }
  };

  const handleBackClick = () => {
    navigate('/admin');
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Gọi API mới để lấy danh sách người dùng
        const { data } = await axios.get(`${API_URL}/api/auth/users/all`);
        setUsers(data); // Cập nhật danh sách người dùng vào state
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUserClick = async (user) => {
    setSelectedUser(user);

    try {
      const { data } = await axios.get(`${API_URL}/api/chat/messages/${user._id}`);
      setMessages((prev) => ({ ...prev, [user._id]: data }));
    } catch (error) {
      console.error('Lỗi khi lấy tin nhắn:', error.response?.data || error.message);
    }
  };

  const sendMessage = async () => {
    if (input.trim() && selectedUser) {
      const newMessage = {
        text: input,
        timestamp: new Date().toISOString(),
        sender: 'admin',
        userId: selectedUser._id,
        isAdmin: true,
      };

      try {
        await axios.post(`${API_URL}/api/chat/messages`, newMessage);

        setMessages((prev) => ({
          ...prev,
          [selectedUser._id]: [...(prev[selectedUser._id] || []), newMessage],
        }));

        setInput('');
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error.response?.data || error.message);
      }
    }
  };

  const sendImage = async (file) => {
    if (file && selectedUser) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', selectedUser._id);

      try {
        const { data } = await axios.post(`${API_URL}/api/chat/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const newMessage = {
          text: '[Hình ảnh]',
          imageUrl: data.imageUrl,
          timestamp: new Date().toISOString(),
          sender: 'admin',
          userId: selectedUser._id,
        };

        setMessages((prev) => ({
          ...prev,
          [selectedUser._id]: [...(prev[selectedUser._id] || []), newMessage],
        }));

        socket.emit('sendMessage', newMessage);
      } catch (error) {
        console.error('Lỗi khi upload hình ảnh:', error.response?.data || error.message);
      }
    }
  };

  const filteredMessages = selectedUser ? messages[selectedUser._id] || [] : [];

  return (
    <div className="chat-container-modern">
      <div className="chat-sidebar-modern">
        <div className="sidebar-header-chat">
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft /> Quay lại
          </button>
          <h3>Danh sách người dùng</h3>
        </div>
        <ul>
          {users.map((user) => {
            const lastMessage =
              messages[user._id] && messages[user._id].length > 0
                ? messages[user._id][messages[user._id].length - 1]
                : null;

            return (
              <li
                key={user._id}
                className={`chat-user-modern ${selectedUser?._id === user._id ? 'active' : ''}`}
                onClick={() => handleUserClick(user)}
              >
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt={user.name}
                  className="user-avatar-modern"
                />
                <div className="user-info-modern">
                  <h4>{user.name}</h4>
                  <p>{lastMessage ? lastMessage.text : 'No messages yet'}</p> {/* Hiển thị tin nhắn mới nhất */}
                  {lastMessage && (
                    <span className="timestamp-modern">
                      {formatTimestamp(lastMessage.timestamp)} {/* Hiển thị thời gian tin nhắn cuối */}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="chat-main-modern">
        {selectedUser ? (
          <>
            <div className="chat-header-modern">
              <img
                src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${selectedUser.name}`}
                alt={selectedUser.name}
                className="user-avatar-modern"
              />
              <h3>{selectedUser.name}</h3>
            </div>
            <div className="chat-messages-modern">
              {filteredMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-message-modern ${msg.sender === 'admin' ? 'outgoing' : 'incoming'
                    }`}
                >
                  {msg.imageUrl ? (
                    <img src={msg.imageUrl} alt="Uploaded" className="chat-image-modern" />
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <span className="timestamp-modern">{formatTimestamp(msg.timestamp)}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-modern">
              <button className="icon-button-modern">
                <FaPaperclip />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
              />
              <button className="icon-button-modern">
                <FaSmile />
              </button>
              <button className="send-button-modern" onClick={sendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder-admin">
            <h3>Chọn một người dùng để bắt đầu chat</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;