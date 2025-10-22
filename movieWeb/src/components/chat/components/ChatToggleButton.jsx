export default function ChatToggleButton({ onClick, hasUnread = false }) {
  return (
    <button 
      className={`chat-toggle-btn ${hasUnread ? 'has-unread' : ''}`} 
      onClick={onClick}
      title="Mở chat"
    >
      <span role="img" aria-label="chat">💬</span>
      {hasUnread && <span className="unread-badge"></span>}
    </button>
  );
}