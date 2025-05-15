import React, { useEffect, useState, useContext } from "react";
import { useWebSocket } from "../../services/WebSocketContext";
import { AdminContext } from "../../services/AdminContext";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationPopup = ({ API_URL }) => {
  const { notifications, setNotifications, unreadCount, setUnreadCount } = useContext(AdminContext); // Lấy giá trị từ AdminContext
  const { socket } = useWebSocket();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) {
      console.error("Socket is null or undefined");
      return;
    }

    socket.on("receiveNotification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      if (socket) {
        socket.off("receiveNotification");
      }
    };
  }, [socket, setNotifications, setUnreadCount]);

  const handleNotificationClick = async (notificationId) => {
    try {
      // Đánh dấu thông báo là đã đọc
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));

      await axios.put(`${API_URL}/api/bookings/notifications/${notificationId}/read`);
      
      navigate(`/admin/booking-detail/${notificationId}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div>
      <div
        className="icon-container"
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
      >
        <FaBell className="icon" />
        <span className="badge">{unreadCount}</span>
      </div>
      {isNotificationOpen && (
        <div className="notification-popup">
          <h4>Thông báo</h4>
          {notifications.length === 0 ? (
            <p>Không có thông báo mới.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  notification.isRead ? "read" : "unread"
                }`}
                onClick={() => handleNotificationClick(notification._id)}
                style={{ cursor: "pointer" }}
              >
                <p>
                  <strong>
                    {notification.user?.name || "Người dùng không xác định"}
                  </strong>{" "}
                  đặt vé cho phim{" "}
                  <strong>
                    {notification.movieTitle || "Phim không xác định"}
                  </strong>
                  .
                </p>
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
                {!notification.isRead && (
                  <span className="new-notification-dot"></span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPopup;