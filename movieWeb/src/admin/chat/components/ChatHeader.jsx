import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import '../styles/ChatHeader.css';

export default function ChatHeader({ user, onSearchClick }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="chat-header-modern">
      <img
        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
        alt={user.name}
        className="user-avatar-modern"
        onClick={() => setIsPanelOpen(true)}
      />
      <h3>{user.name}</h3>

      {/* Panel */}
      {isPanelOpen && (
        <div className="chat-detail-panel">
          <div className="panel-header">
            <h4>Thông tin & Tìm kiếm</h4>
            <button onClick={() => setIsPanelOpen(false)}><FaTimes /></button>
          </div>

          <div className="user-info">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
              alt={user.name}
              className="user-avatar-large"
            />
            <p><strong>{user.name}</strong></p>
            <p>{user.email}</p>
          </div>

          <div className="search-section">
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Tìm tin nhắn..."
                onChange={(e) => onSearchClick(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
