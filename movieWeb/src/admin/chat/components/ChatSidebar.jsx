import { FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';

export default function ChatSidebar({
  users,
  messagesByUser,
  selectedUser,
  onSelectUser,
  isLoading,
  error,
  onBack,
}) {
  return (
    <div className="chat-sidebar-modern">
      <div className="sidebar-header-chat">
        <button className="back-button" onClick={onBack}>
          <FaArrowLeft /> Quay lại
        </button>
        <h3>Danh sách người dùng</h3>
      </div>

      {isLoading && <div className="loading">Đang tải danh sách người dùng...</div>}
      {error && <div className="error">{error}</div>}

      <ul>
        {users.map((user) => {
          const thread = messagesByUser[user._id] || [];
          const last = thread.length ? thread[thread.length - 1] : null;
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
                {last && (
                  <p className="last-message">
                    {last.imageUrl ? '[Hình ảnh]' : last.text}
                    <span className="message-time">
                      {format(new Date(last.timestamp), 'HH:mm')}
                    </span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
