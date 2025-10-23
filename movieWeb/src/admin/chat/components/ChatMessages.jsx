import { format } from 'date-fns';

export default function ChatMessages({ items, onImageClick, endRef, isTyping, searchTerm= '' }) {
  const fmt = (ts) => {
    try { return format(new Date(ts), 'HH:mm:ss dd/MM/yyyy'); }
    catch { return 'Invalid date'; }
  };

  // highlight search text
  const highlightText = (text, keyword) => {
    if (!keyword.trim()) return text;
    const regrex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regrex, '<mark>$1</mark>');
  }

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
            <p
              dangerouslySetInnerHTML={{
                __html: highlightText(msg.text || '', searchTerm),
              }}
            ></p>
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
