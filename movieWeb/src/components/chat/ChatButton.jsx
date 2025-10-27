import { useState, useEffect } from 'react';
import useChatSocket from './hooks/useChatSocket';
import { getMessages, sendMessageAPI, uploadImageAPI } from './services/chat.api';
import ChatToggleButton from './components/ChatToggleButton';
import ChatPopup from './components/ChatPopup';
import ImagePreview from './components/ImagePreview';
import './ChatButton.css';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Setup socket
  const { emitMessage, emitTyping, emitStopTyping } = useChatSocket(
    (data) => {
      // Receive message
      setMessages((prev) => {
        const isDuplicate = prev.some(
          m => m.timestamp === data.timestamp && 
               m.text === data.text && 
               m.sender === data.sender
        );
        return isDuplicate ? prev : [...prev, data];
      });
    },
    {
      onTyping: (data) => {
        if (data.from === 'admin') setIsTyping(true);
      },
      onStopTyping: (data) => {
        if (data.from === 'admin') setIsTyping(false);
      }
    }
  );

  // Load user info from localStorage
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUserId(userInfo._id);
      setUserName(userInfo.name);
    } else {
      console.error('Không tìm thấy userInfo trong localStorage');
    }
  }, []);

  // Load message history
  useEffect(() => {
    const loadMessages = async () => {
      if (!userId) return;
      
      try {
        const data = await getMessages(userId);
        setMessages(data);
      } catch (err) {
        console.error('Lỗi khi lấy tin nhắn:', err);
      }
    };
    
    loadMessages();
  }, [userId]);

  // Handle input change with typing indicator
  const handleInputChange = (value) => {
    setInput(value);
    if (!userId) return;

    if (value.trim().length > 0) {
      emitTyping({ userId, from: 'user', userName });
    } else {
      emitStopTyping({ userId, from: 'user', userName });
    }
  };

  // Send text message
  const handleSendMessage = async () => {
    if (!input.trim() || !userId) return;

    const newMessage = {
      text: input,
      timestamp: new Date().toISOString(),
      sender: 'user',
      userId,
      userName,
      isAdmin: false,
    };

    try {
      await sendMessageAPI(newMessage);
      emitMessage(newMessage);
      setInput('');
      emitStopTyping({ userId, from: 'user', userName });
    } catch (err) {
      console.error('Lỗi khi gửi tin nhắn:', err);
      alert('Lỗi khi gửi tin nhắn. Vui lòng thử lại!');
    }
  };

  // Send image
  const handleImageSelect = async (file) => {
    if (!file || !userId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadData = await uploadImageAPI(formData);
      const { imageUrl, cloudinaryId, imageSize, imageName } = uploadData;

      const newMessage = {
        text: '[Hình ảnh]',
        imageUrl,
        cloudinaryId,
        imageSize,
        imageName,
        timestamp: new Date().toISOString(),
        sender: 'user',
        userId,
        userName,
        isAdmin: false,
      };

      await sendMessageAPI(newMessage);
      emitMessage(newMessage);
      
      setMessages(prev => [...prev, newMessage]);
      emitStopTyping({ userId, from: 'user', userName });
    } catch (err) {
      console.error('Lỗi khi gửi ảnh:', err);
      alert('Lỗi khi upload ảnh. Vui lòng thử lại!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="chat-container">
      <ChatToggleButton onClick={() => setIsOpen(!isOpen)} />

      <ChatPopup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        input={input}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        onImageSelect={handleImageSelect}
        onImageClick={setPreviewImage}
        isTyping={isTyping}
        isUploading={isUploading}
      />

      <ImagePreview 
        src={previewImage} 
        onClose={() => setPreviewImage(null)} 
      />
    </div>
  );
}