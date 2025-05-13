import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import API_URL from "../api/config"; // Đường dẫn đến API_URL

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(`${API_URL}`, {
      transports: ["websocket"], // Sử dụng WebSocket thay vì polling
      timeout: 10000, // Tăng thời gian timeout nếu cần
    });

    socketInstance.on("connect", () => {
      console.log("✅ WebSocket connected");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ WebSocket connection error:", error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};