import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Tách socket để dễ thay đổi endpoint khi deploy
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function useChatSocket(onReceive, { onTyping, onStopTyping } = {}) {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    const s = socketRef.current;

    if (onReceive) s.on('receiveMessage', onReceive);
    if (onTyping) s.on("typing", onTyping); //lang nghe typing
    if (onStopTyping) s.on("stopTyping", onStopTyping);

    return () => {
      s.off('receiveMessage', onReceive);
      if (onTyping) s.off('typing', onTyping);
      if (onStopTyping) s.off('stopTyping', onStopTyping);
      s.close();
    };
  }, [onReceive, onTyping, onStopTyping]);

  const emitMessage = (payload) => socketRef.current?.emit('sendMessage', payload);
  const emitTyping = (payload) => socketRef.current?.emit('typing', payload);
  const emitStopTyping = (payload) => socketRef.current?.emit('stopTyping', payload);

  return { emitMessage, emitTyping, emitStopTyping };
}
