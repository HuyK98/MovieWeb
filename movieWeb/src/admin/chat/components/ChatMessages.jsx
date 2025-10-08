import { format } from 'date-fns';

export default function ChatMessages({ items, onImageClick, endRef, isTyping }) {
  const fmt = (ts) => {
    try { return format(new Date(ts), 'HH:mm:ss dd/MM/yyyy'); }
    catch { return 'Invalid date'; }
  };

  return (
    <div className="chat-messages-modern">
      {items.map((msg, idx) => (
        <div
          key={idx}
          className={`chat-message-modern ${msg.sender === 'admin' || msg.isAdmin ? 'outgoing' : 'incoming'}`}
        >
          {msg.imageUrl ? (
            <img
              src={msg.imageUrl}
              alt="Uploaded"
              className="chat-image-modern"
              onClick={() => onImageClick(msg.imageUrl)}
            />
          ) : (
            <p>{msg.text}</p>
          )}
          <span className="timestamp-modern">{fmt(msg.timestamp)}</span>
        </div>
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
