import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { format } from 'date-fns';
import '../styles/ChatButton.css';

function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm:ss dd/MM/yyyy'); // Định dạng giờ:phút:giây ngày/tháng/năm
    } catch (error) {
      console.error('Lỗi định dạng thời gian:', error);
      return 'Invalid date';
    }
  };

  // Cuộn đến tin nhắn mới nhất
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Gọi scrollToBottom mỗi khi danh sách tin nhắn thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cuộn đến tin nhắn mới nhất khi mở phần chat
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

  // Lấy thông tin người dùng từ localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUserId(userInfo._id);
      setUserName(userInfo.name);
    } else {
      console.error('❌ Không tìm thấy thông tin người dùng trong localStorage');
    }
  }, []);

  // Kết nối Socket.IO
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO connection established:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Lắng nghe sự kiện nhận tin nhắn từ admin
  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (data) => {
        console.log('📩 Tin nhắn nhận được:', data);

        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const existingMessages = prev[data.userId] || [];
          const isDuplicate = existingMessages.some(
            msg =>
              msg.timestamp === data.timestamp &&
              msg.text === data.text &&
              msg.sender === data.sender
          );

          if (isDuplicate) {
            return prev;
          }

          return {
            ...prev,
            [data.userId]: [...existingMessages, data],
          };
        });
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket]);

  // Lấy tin nhắn từ server khi tải trang
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/chat/messages/${userId}`);
        setMessages((prev) => ({
          ...prev,
          [userId]: data,
        }));
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error.response?.data || error.message);
      }
    };

    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  // Gửi tin nhắn từ user
  const sendMessage = async () => {
    if (socket && socket.connected && input.trim() && userId) {
      const newMessage = {
        text: input,
        timestamp: new Date().toISOString(),
        sender: 'user',
        userId: userId,
        userName: userName,
        isAdmin: false,
      };

      console.log('Tin nhắn gửi đi từ user:', newMessage);

      try {
        await axios.post('http://localhost:5000/api/chat/messages', newMessage);
        socket.emit('sendMessage', newMessage);
        setInput('');
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error.response?.data || error.message);
      }
    }
  };

  // Gửi hình ảnh
  const sendImage = async (file) => {
    if (file && userId) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', userId);

      try {
        const { data } = await axios.post('http://localhost:5000/api/chat/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const newMessage = {
          text: '[Hình ảnh]',
          imageUrl: data.imageUrl, // URL của ảnh từ server
          timestamp: new Date().toISOString(),
          sender: 'user',
          userId: userId,
          userName: userName,
          isAdmin: false,
        };

        // Gửi tin nhắn qua Socket.IO
        socket.emit('sendMessage', newMessage);

        // Thêm tin nhắn vào state local
        setMessages((prev) => ({
          ...prev,
          [userId]: [...(prev[userId] || []), newMessage],
        }));
      } catch (error) {
        console.error('Lỗi khi upload hình ảnh:', error.response?.data || error.message);
      }
    }
  };

  // Xử lý khi nhấn Enter để gửi tin nhắn
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
            {(messages[userId] || []).map((msg, index) => {
              // Log ra để kiểm tra
              console.log(`Message ${index}:`, msg, 'isAdmin:', msg.isAdmin, 'sender:', msg.sender);

              // Phân biệt dựa trên cả isAdmin và sender
              const isFromAdmin = (msg.isAdmin === true) || (msg.sender === 'admin');

              return (
                <div
                  key={index}
                  className={isFromAdmin ? 'admin-msg' : 'user-msg'}
                >
                  {msg.imageUrl ? (
                    <img src={msg.imageUrl} alt="Uploaded" className="chat-image" />
                  ) : (
                    <p>{msg.text}</p>
                  )}
                  <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => sendImage(e.target.files[0])} // Gọi hàm xử lý upload ảnh
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