import React, { useEffect, useState, useContext } from "react";
import { useWebSocket } from "../../services/WebSocketContext";
import { AdminContext } from "../../services/AdminContext";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../../api/config"; // Import API_URL từ file config

const NotificationPopup = () => {
  const { notifications, setNotifications, unreadCount, setUnreadCount } =
    useContext(AdminContext); // Lấy giá trị từ AdminContext
  const { socket } = useWebSocket();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();

  // Gọi API để lấy danh sách thông báo khi component được mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;

        if (!userInfo || !userInfo.token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/bookings/notifications`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        const notifications = Array.isArray(response.data)
          ? response.data
          : response.data.data;

        if (Array.isArray(notifications)) {
          setNotifications(notifications); // Lưu danh sách thông báo vào state
          setUnreadCount(notifications.filter((n) => !n.isRead).length); // Đếm số thông báo chưa đọc

          // Lưu vào localStorage
          localStorage.setItem("notifications", JSON.stringify(notifications));
          localStorage.setItem(
            "unreadCount",
            notifications.filter((n) => !n.isRead).length
          );
        } else {
          console.error(
            "Notifications API did not return an array:",
            response.data
          );
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
  }, [setNotifications, setUnreadCount]);

  // Lắng nghe thông báo mới từ WebSocket
  useEffect(() => {
    if (!socket) {
      console.error("Socket is null or undefined");
      return;
    }

    socket.on("receiveNotification", (newNotification) => {
      setNotifications((prev) => {
        const updatedNotifications = [newNotification, ...prev].slice(0, 10); // Giới hạn 10 thông báo
        localStorage.setItem(
          "notifications",
          JSON.stringify(updatedNotifications)
        ); // Lưu vào localStorage
        return updatedNotifications;
      });

      setUnreadCount((prev) => {
        const updatedUnreadCount = prev + 1;
        localStorage.setItem("unreadCount", updatedUnreadCount); // Lưu vào localStorage
        return updatedUnreadCount;
      });
    });

    return () => {
      if (socket) {
        socket.off("receiveNotification");
      }
    };
  }, [socket, setNotifications, setUnreadCount]);

  const handleNotificationClick = async (notificationId) => {
    // Cập nhật state trước khi gọi API
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));

    try {
      // console.log("Notification ID:", notificationId); // Debug ID được gửi
      // console.log("API_URL:", API_URL); // Debug API_URL

      await axios.put(
        `${API_URL}/api/bookings/notifications/${notificationId}/read`
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      navigate(`/admin/booking-detail/${notificationId}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Khôi phục trạng thái nếu API thất bại
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: false } : n
        )
      );
      setUnreadCount((prev) => prev + 1);
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
