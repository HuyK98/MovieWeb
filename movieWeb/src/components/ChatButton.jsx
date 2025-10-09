import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { format } from 'date-fns';
import '../styles/ChatButton.css';

// Cấu hình API URL từ environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm:ss dd/MM/yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  useEffect(() => { if (isOpen) scrollToBottom(); }, [isOpen]);

  // Lấy thông tin user
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUserId(userInfo._id);
      setUserName(userInfo.name);
    } else {
      console.error('❌ Không tìm thấy userInfo trong localStorage');
    }
  }, []);

  // Kết nối socket
  useEffect(() => {
    const s = io(API_BASE_URL, { transports: ['websocket'] });
    setSocket(s);

    s.on('connect', () => console.log('Socket connected:', s.id));
    s.on('disconnect', () => console.log('Socket disconnected'));
    s.on('connect_error', (e) => console.error('Socket error:', e));

    // Nhận tin nhắn realtime
    s.on('receiveMessage', (data) => {
      setMessages((prev) => {
        const list = prev[data.userId] || [];
        const dup = list.some(
          m => m.timestamp === data.timestamp && m.text === data.text && m.sender === data.sender
        );
        if (dup) return prev;
        return { ...prev, [data.userId]: [...list, data] };
      });
    });

    // Nhận typing từ admin
    s.on('typing', (data) => {
      if (data.from === 'admin') setIsTyping(true);
    });
    s.on('stopTyping', (data) => {
      if (data.from === 'admin') setIsTyping(false);
    });

    return () => {
      s.off('receiveMessage');
      s.off('typing');
      s.off('stopTyping');
      s.disconnect();
    };
  }, []);

  // Lấy lịch sử khi đã có userId
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/chat/messages/${userId}`);
        setMessages((prev) => ({ ...prev, [userId]: data }));
      } catch (err) {
        console.error('Lỗi khi lấy tin nhắn:', err.response?.data || err.message);
      }
    };
    if (userId) fetchMessages();
  }, [userId]);

  // emit typing khi user gõ
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (!socket || !userId) return;

    if (val.trim().length > 0) {
      socket.emit('typing', { userId, from: 'user', userName });
    } else {
      socket.emit('stopTyping', { userId, from: 'user', userName });
    }
  };

  const sendMessage = async () => {
    if (!socket?.connected || !input.trim() || !userId) return;

    const newMessage = {
      text: input,
      timestamp: new Date().toISOString(),
      sender: 'user',
      userId,
      userName,
      isAdmin: false,
    };

    try {
      await axios.post(`${API_BASE_URL}/api/chat/messages`, newMessage);
      socket.emit('sendMessage', newMessage);
      setInput('');

      // khi gửi xong coi như dừng gõ
      socket.emit('stopTyping', { userId, from: 'user', userName });
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err.response?.data || err.message);
    }
  };

  const handleKeyPress = (e) => { if (e.key === 'Enter') sendMessage(); };

  const sendImage = async (file) => {
    if (!file || !userId) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadResponse = await axios.post(`${API_BASE_URL}/api/chat/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = uploadResponse.data.imageUrl;
      const newMessage = {
        text: '[Hình ảnh]',
        imageUrl,
        timestamp: new Date().toISOString(),
        sender: 'user',
        userId,
        userName,
        isAdmin: false,
      };

      await axios.post(`${API_BASE_URL}/api/chat/messages`, newMessage);
      socket.emit('sendMessage', newMessage);

      setMessages(prev => ({
        ...prev,
        [userId]: [...(prev[userId] || []), newMessage],
      }));
    } catch (err) {
      console.error('Error sending image:', err);
    }
  };

  return (
    <div className="chat-container">
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        <span role="img" aria-label="chat">💬</span>
      </button>

      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Chat với Admin</h3>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chat-messages">
            {(messages[userId] || []).map((msg, i) => {
              const isFromAdmin = (msg.isAdmin === true) || (msg.sender === 'admin');
              return (
                <div key={i} className={isFromAdmin ? 'admin-msg' : 'user-msg'}>
                  {msg.imageUrl ? (
                    <img
                      src={msg.imageUrl}
                      alt="Uploaded"
                      className="chat-image"
                      onClick={() => setPreviewImage(msg.imageUrl)}
                    />
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
                </div>
              );
            })}

            {/* Typing tu admin */}
            {isTyping && (
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {previewImage && (
            <div className="image-overlay" onClick={() => setPreviewImage(null)}>
              <img src={previewImage} alt="Preview" />
            </div>
          )}

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Nhập tin nhắn..."
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => sendImage(e.target.files[0])}
              style={{ display: 'none' }}
              id="upload-image"
            />
            <label htmlFor="upload-image" className="upload-btn">📷</label>
            <button onClick={sendMessage}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatButton;