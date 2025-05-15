import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminContext = createContext();

const AdminProvider = ({ children, API_URL, socket }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch user profile
    const fetchUser = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;

        if (!userInfo || !userInfo.token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`${API_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;

        if (!userInfo || !userInfo.token) {
          return;
        }

        const response = await axios.get(`${API_URL}/api/bookings/notifications`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const notifications = Array.isArray(response.data)
          ? response.data
          : response.data.data;
        // console.log("Notifications:", notifications);
        if (Array.isArray(notifications)) {
          setNotifications(notifications);
          setUnreadCount(notifications.filter((n) => !n.isRead).length); // Đếm số thông báo chưa đọc

          // Lưu vào localStorage
          localStorage.setItem("notifications", JSON.stringify(notifications));
          localStorage.setItem(
            "unreadCount",
            notifications.filter((n) => !n.isRead).length
          );
        } else {
          console.error("Notifications API did not return an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Khôi phục trạng thái từ localStorage
    const savedNotifications = localStorage.getItem("notifications");
    const savedUnreadCount = localStorage.getItem("unreadCount");

    if (savedNotifications && savedUnreadCount) {
      setNotifications(JSON.parse(savedNotifications));
      setUnreadCount(parseInt(savedUnreadCount, 10));
    } else {
      fetchNotifications();
    }

    fetchUser();
    fetchNotifications();

    // Listen for new notifications via WebSocket
    if (socket) {
      socket.on("receiveNotification", (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
        setUnreadCount((prev) => prev + 1);
      });
    } 

    return () => {
      if (socket) {
        socket.off("receiveNotification");
      }
    };
  }, [API_URL, socket]);

  return (
    <AdminContext.Provider
      value={{
        user,
        notifications,
        unreadCount,
        setNotifications,
        setUnreadCount,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;