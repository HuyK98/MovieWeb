import { FaPaperPlane, FaSmile, FaPaperclip } from 'react-icons/fa';
import '../styles/ChatInput.css';

export default function ChatInput({ value, onChange, onSend, onSendImage }) {
  return (
    <div className="chat-input-modern">
      <input
        type="file"
        id="file-upload"
        style={{ display: 'none' }}
        onChange={(e) => onSendImage(e.target.files?.[0])}
        accept="image/*"
      />
      <label htmlFor="file-upload" className="icon-button-modern">
        <FaPaperclip />
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập tin nhắn..."
        onKeyDown={(e) => { if (e.key === 'Enter') onSend(); }}
      />

      <button className="icon-button-modern" type="button" aria-label="emoji">
        <FaSmile />
      </button>

      <button className="send-button-modern" onClick={onSend} type="button">
        <FaPaperPlane />
      </button>
    </div>
  );
}
