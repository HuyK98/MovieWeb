import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

export default function ChatPopup({ 
  isOpen,
  onClose,
  messages,
  input,
  onInputChange,
  onSendMessage,
  onImageSelect,
  onImageClick,
  isTyping,
  isUploading
}) {
  if (!isOpen) return null;

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <h3>Chat với Admin</h3>
        <button className="close-btn" onClick={onClose} title="Đóng">×</button>
      </div>

      <ChatMessage
        messages={messages}
        onImageClick={onImageClick}
        isTyping={isTyping}
        isUploading={isUploading}
      />

      <ChatInput
        value={input}
        onChange={onInputChange}
        onSend={onSendMessage}
        onImageSelect={onImageSelect}
        disabled={isUploading}
      />
    </div>
  );
}