import React, { useState, useEffect } from "react";
import { FaBell, FaEnvelope, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client"; // Import socket.io-client
import "../../styles/HeaderAdmin.css";
import API_URL from "../../api/config";

const HeaderAdmin = () => {
  const [user, setUser] = useState(null); // Lưu thông tin người dùng
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Trạng thái popup thông báo
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [uploading, setUploading] = useState(false); // Trạng thái upload
  const [notifications, setNotifications] = useState([]); // Lưu danh sách thông báo
  const [unreadCount, setUnreadCount] = useState(0); // Số lượng thông báo chưa được xem
  const navigate = useNavigate();

  // Kết nối với server WebSocket qua socket.io
  useEffect(() => {
    const socket = io(`$${API_URL}`, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }); // Kết nối đến server socket.io

    socket.on("connect", () => {
      console.log("Socket.IO connected:", socket.id);
    });

    socket.on("receiveNotification", (newNotification) => {
      // console.log("New notification received:", newNotification);
      // Lưu thông báo mới vào localStorage
    const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
    const updatedNotifications = [newNotification, ...storedNotifications];
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));

    // Cập nhật state
    setNotifications(updatedNotifications.slice(0, 10)); // Giới hạn 10 thông báo
    setUnreadCount((prevCount) => prevCount + 1);
  });

    socket.on("disconnect", () => {
      console.warn("Socket.IO disconnected");
    });

    return () => {
      socket.disconnect(); // Ngắt kết nối khi component bị unmount
    };
  }, []);

  // Gọi API để lấy danh sách thông báo
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/bookings/notifications`
        );
        setNotifications(response.data); // Lưu danh sách thông báo vào state

        // Tính số lượng thông báo chưa được xem
        const unread = response.data.filter(
          (notification) => !notification.isRead
        ).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          console.error("Request made but no response:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
      }
    };

    fetchNotifications();
  }, []);

  // Gọi API để lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;

        if (!userInfo || !userInfo.token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          `${API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`, // Gửi token trong header
            },
          }
        );

        setUser(response.data); // Lưu thông tin người dùng vào state
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Điều hướng về trang login nếu có lỗi
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Xóa token khi logout
    navigate("/login");
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      // Đánh dấu thông báo đã đọc trong backend
      await axios.put(
        `${API_URL}/api/bookings/notifications/${notificationId}/read`
      );

      // Cập nhật trạng thái isRead trong danh sách thông báo
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true } // Cập nhật trạng thái isRead
            : notification
        )
      );
      // Giảm số lượng thông báo mới (badge)
      setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
      // Chuyển hướng đến trang chi tiết thông báo
      navigate(`/admin/booking-detail/${notificationId}`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <header className="header-admin">
      <div className="header-left">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="header-right">
        {/* Chuông thông báo */}
        <div
          className="icon-container"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        >
          <FaBell className="icon" />
          <span className="badge">{unreadCount}</span>
        </div>

        {/* Popup danh sách thông báo */}
        {isNotificationOpen && (
          <div className="notification-popup">
            <h4>Thông báo</h4>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="notification-item"
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
            ) : (
              <p>Không có thông báo mới.</p>
            )}
          </div>
        )}

        {/* Hộp thư */}
        <div
          className="icon-container"
          onClick={() => navigate("/admin/messages")}
        >
          <FaEnvelope className="icon" />
          <span className="badge">5</span>
        </div>

        {/* Admin Profile */}
        <div
          className="profile-container"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            src={`${API_URL}${user?.image || "/default-avatar.png"}`}
            alt="Admin Avatar"
            className="profile-image"
          />
          <span className="profile-name">{user?.name || "Admin"}</span>
          <span className="dropdown-arrow">▼</span>
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div
              className="dropdown-item"
              onClick={() => setIsProfileOpen(true)}
            >
              <FaUserCircle className="dropdown-icon" />
              My Profile
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              <FaSignOutAlt className="dropdown-icon" />
              Log Out
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderAdmin;