import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function useChatSocket(onReceive, { onTyping, onStopTyping } = {}) {
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingDebounceRef = useRef(null);
  const isTypingRef = useRef(false);

  const onReceiveRef = useRef(onReceive);
  const onTypingRef = useRef(onTyping);
  const onStopTypingRef = useRef(onStopTyping);
  useEffect(() => { onReceiveRef.current = onReceive }, [onReceive]);
  useEffect(() => { onTypingRef.current = onTyping }, [onTyping]);
  useEffect(() => { onStopTypingRef.current = onStopTyping }, [onStopTyping]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      withCredentials: true,
    });
    const s = socketRef.current;

    if (onReceiveRef.current) s.on('receiveMessage', (...args) => onReceiveRef.current?.(...args));

    s.on('typing', (data) => {
      onTypingRef.current?.(data);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onStopTypingRef.current?.(data);
      }, 3000);
    });

    s.on('stopTyping', (data) => {
      clearTimeout(typingTimeoutRef.current);
      onStopTypingRef.current?.(data);
    });

    // them log de bat loi disconnect
    s.on('connect_error', (err) => console.warn('[socket connect_error]', err?.message));
    s.on('reconnect_attempt', (n) => console.log('[socket reconnect_attempt]', n));
    s.on('disconnect', (reason) => console.log('[socket disconnect]', reason));

    return () => {
      clearTimeout(typingTimeoutRef.current);
      clearTimeout(typingDebounceRef.current);
      s.off();
      s.close();
    };
  }, []);  // chi mount lan dau

  const emitMessage = useCallback((payload) => socketRef.current?.emit('sendMessage', payload), []);
  const emitTyping = useCallback((payload) => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current?.emit('typing', payload);
    }
    clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socketRef.current?.emit('stopTyping', payload);
      }
    }, 1000);
  }, []);
  const emitStopTyping = useCallback((payload) => {
    clearTimeout(typingDebounceRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socketRef.current?.emit('stopTyping', payload);
    }
  }, []);

  return { emitMessage, emitTyping, emitStopTyping };
}
