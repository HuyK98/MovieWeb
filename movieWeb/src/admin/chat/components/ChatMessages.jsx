import "../styles/ChatMessages.css";
import MessageItem from "./MessageItem";

export default function ChatMessages({ items, onImageClick, endRef, isTyping, searchTerm = '' }) {
  return (
    <div className="chat-messages-modern">
      {items.map((msg, idx) => (
        <MessageItem
          key={idx}
          msg={msg}
          onImageClick={onImageClick}
          searchTerm={searchTerm}
        />
      ))}

      {isTyping && (
        <div className="chat-message-modern incoming">
          <div className="typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
