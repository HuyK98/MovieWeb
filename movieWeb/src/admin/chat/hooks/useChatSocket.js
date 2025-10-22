import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function useChatSocket(onReceive, { onTyping, onStopTyping } = {}) {
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingDebounceRef = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    const s = socketRef.current;

    if (onReceive) s.on('receiveMessage', onReceive);

    if (onTyping) {
      s.on("typing", (data) => {
        onTyping(data);
        
        // Auto-clear typing indicator sau 3s nếu không nhận stopTyping
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          if (onStopTyping) onStopTyping(data);
        }, 3000);
      });
    }

    if (onStopTyping) {
      s.on("stopTyping", (data) => {
        clearTimeout(typingTimeoutRef.current);
        onStopTyping(data);
      });
    }

    return () => {
      clearTimeout(typingTimeoutRef.current);
      clearTimeout(typingDebounceRef.current);
      s.off('receiveMessage', onReceive);
      if (onTyping) s.off('typing', onTyping);
      if (onStopTyping) s.off('stopTyping', onStopTyping);
      s.close();
    };
  }, [onReceive, onTyping, onStopTyping]);

  const emitMessage = (payload) => socketRef.current?.emit('sendMessage', payload);

  const emitTyping = (payload) => {
    // Kiểm tra xem đã báo đang typing chưa
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current?.emit('typing', payload);
    }

    // Hủy hẹn giờ cũ
    clearTimeout(typingDebounceRef.current);

    // Hẹn giờ mới - sau 1s không gõ sẽ tự động dừng
    typingDebounceRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socketRef.current?.emit('stopTyping', payload);
      }
    }, 1000);
  };

  const emitStopTyping = (payload) => {
    clearTimeout(typingDebounceRef.current);

    if (isTypingRef.current) {
      isTypingRef.current = false;
      socketRef.current?.emit('stopTyping', payload);
    }
  };

  return { emitMessage, emitTyping, emitStopTyping };
}