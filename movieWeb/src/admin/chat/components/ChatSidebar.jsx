import { FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';

export default function ChatSidebar({
  users,
  selectedUser,
  onSelectUser,
  isLoading,
  error,
  onBack,
  searchQuery = '',
  onSearch = () => {},
}) {
  return (
    <div className="chat-sidebar-modern">
      <div className="sidebar-header-chat">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> Quay lại
        </button>
        <h3>Danh sách người dùng</h3>

        {/* search chat */}
        <input
          className='sidebar-search'
          type='text'
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder='Tìm theo tên, email, nội dung...'
          />
      </div>

      {isLoading && <div className="loading">Đang tải danh sách người dùng...</div>}
      {error && <div className="error">{error}</div>}

      <ul>
        {users.map((user) => {
          const lastMessage = user.lastMessage;
          
          return (
            <li
              key={user._id}
              className={`chat-user-modern ${selectedUser?._id === user._id ? 'active' : ''}`}
              onClick={() => onSelectUser(user)}
            >
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
                alt={user.name}
                className="user-avatar-modern"
              />
              <div className="user-info-modern">
                <h4>{user.name}</h4>
                
                {lastMessage ? (
                  <p className="last-message">
                    {lastMessage.imageUrl ? (
                      <span className="message-text">[Hình ảnh]</span>
                    ) : (
                      <span className="message-text">
                        {lastMessage.text && lastMessage.text.length > 30 
                          ? lastMessage.text.substring(0, 30) + '...' 
                          : (lastMessage.text || 'Không có nội dung')}
                      </span>
                    )}
                    {lastMessage.timestamp && (
                      <span className="message-time">
                        {format(new Date(lastMessage.timestamp), 'HH:mm')}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="no-message">Chưa có tin nhắn</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}