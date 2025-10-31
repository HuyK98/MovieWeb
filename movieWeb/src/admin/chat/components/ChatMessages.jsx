import { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import "../styles/ChatMessages.css";

export default function ChatMessages({
  items,
  onImageClick,
  isTyping,
  searchTerm = "",
  onLoadMore,
  hasMore,
}) {
  const scrollRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const prevHeightRef = useRef(0);

  // Tự động cuộn xuống cuối khi có tin nhắn mới (chỉ khi người dùng chưa scroll lên)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [items.length]);

  // Load thêm khi scroll lên đầu
  const handleScroll = async (e) => {
    const el = e.target;
    if (el.scrollTop === 0 && hasMore && !loading) {
      setLoading(true);
      prevHeightRef.current = el.scrollHeight;
      await onLoadMore?.();
      requestAnimationFrame(() => {
        // giữ nguyên vị trí scroll sau khi load
        el.scrollTop = el.scrollHeight - prevHeightRef.current;
      });
      setLoading(false);
    }
  };

  return (
    <div
      className="chat-messages-modern"
      ref={scrollRef}
      onScroll={handleScroll}
      style={{ overflowY: "auto", height: "100%", padding: "10px" }}
    >
      {loading && (
        <div className="loading-old">
          <span>Đang tải tin nhắn cũ...</span>
        </div>
      )}

      {items.map((msg, i) => (
        <MessageItem
          key={msg.id || msg.timestamp || i}
          msg={msg}
          onImageClick={onImageClick}
          searchTerm={searchTerm}
        />
      ))}

      {isTyping && (
        <div className="chat-message-modern incoming">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
    </div>
  );
}
