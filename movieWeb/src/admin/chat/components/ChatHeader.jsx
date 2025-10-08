export default function ChatHeader({ user }) {
  return (
    <div className="chat-header-modern">
      <img
        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
        alt={user.name}
        className="user-avatar-modern"
      />
      <h3>{user.name}</h3>
    </div>
  );
}
