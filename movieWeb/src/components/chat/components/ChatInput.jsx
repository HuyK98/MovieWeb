export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  onImageSelect,
  disabled = false 
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !disabled && value.trim()) {
      onSend();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Nhập tin nhắn..."
        disabled={disabled}
      />
      
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            onImageSelect(file);
            e.target.value = ''; // Reset input
          }
        }}
        style={{ display: 'none' }}
        id="upload-image-user"
        disabled={disabled}
      />
      
      <label 
        htmlFor="upload-image-user" 
        className={`upload-btn ${disabled ? 'disabled' : ''}`}
        title="Gửi hình ảnh"
      >
        📷
      </label>
      
      <button 
        onClick={onSend} 
        disabled={disabled || !value.trim()}
      >
        Gửi
      </button>
    </div>
  );
}