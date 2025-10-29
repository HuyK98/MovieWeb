import { formatTime, processText, downloadImage } from "../hooks/useMessageActions";
import { FiDownload } from "react-icons/fi";
import "../styles/ChatMessages.css";

export default function MessageItem({ msg, onImageClick, searchTerm }) {
  const isOutgoing = msg.sender === "admin" || msg.isAdmin;

  return (
    <div className={`chat-message-modern ${isOutgoing ? "outgoing" : "incoming"}`}>
      {msg.imageUrl ? (
        <div className="chat-image-block">
          <img
            src={msg.imageUrl}
            alt="Uploaded"
            className="chat-image-modern"
            onClick={() => onImageClick(msg.imageUrl)}
          />
          <button
            className="download-btn"
            onClick={(e) => {
              e.stopPropagation();
              downloadImage(msg.imageUrl);
            }}
          >
            <FiDownload className="download-icon" />
          </button>
        </div>
      ) : (
        <p
          dangerouslySetInnerHTML={{
            __html: processText(msg.text || "", searchTerm),
          }}
        ></p>
      )}
      <span className="timestamp-modern">{formatTime(msg.timestamp)}</span>
    </div>
  );
}
