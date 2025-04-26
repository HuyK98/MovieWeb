import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import API_URL from "../api/config"; // Đường dẫn đến API_URL

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const newSocket = io(`${API_URL}`, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket.IO connected:", newSocket.id);
    });

    newSocket.on("receiveNotification", (newNotification) => {
      console.log("New notification received:", newNotification);
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications].slice(0, 10));
      setUnreadCount((prevCount) => prevCount + 1);
    });

    newSocket.on("disconnect", () => {
      console.warn("Socket.IO disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, notifications, unreadCount, setNotifications, setUnreadCount }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);