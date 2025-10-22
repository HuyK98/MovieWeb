import { useRef, useEffect } from 'react';
import { formatTimestamp } from '../utils/formatters';

export default function ChatMessage({ 
  messages, 
  onImageClick, 
  isTyping, 
  isUploading 
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isUploading]);

  return (
    <div className="chat-messages">
      {messages.map((msg, i) => {
        const isFromAdmin = (msg.isAdmin === true) || (msg.sender === 'admin');
        return (
          <div key={i} className={isFromAdmin ? 'admin-msg' : 'user-msg'}>
            {msg.imageUrl ? (
              <img
                src={msg.imageUrl}
                alt="Uploaded"
                className="chat-image"
                onClick={() => onImageClick(msg.imageUrl)}
              />
            ) : (
              <p>{msg.text}</p>
            )}
            <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
          </div>
        );
      })}

      {isTyping && (
        <div className="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      )}

      {isUploading && (
        <div className="uploading-indicator">
          <p>Đang upload ảnh...</p>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}