import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaEnvelope, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "../../styles/HeaderAdmin.css";

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
    const socket = io("http://localhost:5000", {
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
          "http://localhost:5000/api/bookings/notifications"
        );
        setNotifications(response.data); // Lưu danh sách thông báo vào state

        // Tính số lượng thông báo chưa được xem
        const unread = response.data.filter((notification) => !notification.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications:", error);
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
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`, // Gửi token trong header
            },
          }
        );
        // console.log("User data:", response.data); // Log dữ liệu người dùng
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

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true); // Bắt đầu trạng thái upload
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;

      const response = await axios.post(
        "http://localhost:5000/api/auth/upload", // API upload hình ảnh
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.imageUrl; // URL hình ảnh trả về từ API

      // Cập nhật URL hình ảnh trong cơ sở dữ liệu
      await axios.put(
        `http://localhost:5000/api/auth/profile`, // API cập nhật thông tin người dùng
        { image: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật state user với URL hình ảnh mới
      setUser((prevUser) => ({ ...prevUser, image: imageUrl }));
      setUploading(false); // Kết thúc trạng thái upload
    } catch (error) {
      console.error("Error uploading image:", error);
      if (error.response) {
        console.error("Backend response:", error.response.data); // Log chi tiết lỗi từ backend
        console.error("Status code:", error.response.status); // Log mã trạng thái HTTP
      } else {
        console.error("Error message:", error.message); // Log thông báo lỗi nếu không có phản hồi từ backend
      }
      setUploading(false);
    }
  };

  // Hàm xử lý khi click vào một thông báo
  const handleNotificationClick = async (notificationId) => {
    try {
      // Đánh dấu thông báo đã đọc trong backend
      await axios.put(
        `http://localhost:5000/api/bookings/notifications/${notificationId}/read`
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
          <span className="badge">{unreadCount}</span> {/* Hiển thị số lượng thông báo mới */}
          {/* Hiển thị số lượng thông báo */}
        </div>

        {/* Popup danh sách thông báo */}
        {isNotificationOpen && (
          <div className="notification-popup">
            <h4>Thông báo</h4>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification._id}
                  className="notification-item"
                  onClick={() => handleNotificationClick(notification._id)} // Xử lý click vào thông báo
                  style={{ cursor: "pointer" }} // Thêm con trỏ chuột để hiển thị có thể click
                >
                  <p>
                    {/* <strong>
                      {notification.user?.imageUrl || "null"}
                    </strong> */}
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
                  {/* Dấu chấm màu xanh cho thông báo mới */}
                  {!notification.isRead && <span className="new-notification-dot"></span>}
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
          onClick={() => navigate("/admin/chat")} // Điều hướng đến Chat.jsx
        >
          <FaEnvelope className="icon" />
        </div>

        {/* Admin Profile */}
        <div
          className="profile-container"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            src={`http://localhost:5000${user?.image || "/default-avatar.png"}`} // Thêm tiền tố URL server
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

      {/* My Profile Modal */}
      {isProfileOpen && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <h2>My Profile</h2>
            <div className="profile-image-upload">
              <label htmlFor="profile-image-input" className="upload-label">
                <div className="upload-circle">
                  {uploading ? (
                    <span>Uploading...</span>
                  ) : (
                    <img
                      src={`http://localhost:5000${user?.image || "/default-avatar.png"
                        }`} // Thêm tiền tố URL server
                      alt="Profile"
                    />
                  )}
                </div>
              </label>
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                style={{ display: "none" }}
              />
            </div>
            <div className="profile-info">
              <p>
                <strong>Name:</strong> {user?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone || "N/A"}
              </p>
            </div>
            <button
              className="close-button"
              onClick={() => setIsProfileOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderAdmin;