import React, { useState, useContext, useRef } from "react";
import { FaUserCircle, FaSignOutAlt, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../services/AdminContext";
import API_URL from "../../api/config";
import axios from "axios";
import "../../styles_admin/ProfileAdmin.css"; // Import CSS styles for the profile component

const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useContext(AdminContext);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(false);
    setIsAvatarModalOpen(true);
  };

  const handleUpdateAvatar = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const response = await axios.post(
        `${API_URL}/api/auth/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (response.data.imageUrl) {
        window.location.reload(); // Reload để cập nhật avatar mới
      }
    } catch (error) {
      alert("Lỗi khi cập nhật ảnh đại diện!");
    }
  };

  return (
    <div>
      {/* Dropdown toggle */}
      <div className="profile-container" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
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
            onClick={() => {
              setIsProfileOpen(true);
              setIsDropdownOpen(false);
            }}
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

      {/* Profile Modal */}
      {isProfileOpen && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <h3>My Profile</h3>
            <div className="profile-image-upload">
              <div className="upload-circle" style={{ position: "relative" }}>
                <img
                  src={`${API_URL}${user?.image || "/default-avatar.png"}`}
                  alt="User Avatar"
                  style={{ cursor: "pointer" }}
                  onClick={handleAvatarClick}
                  title="Xem ảnh đại diện"
                />
                <FaCamera
                  className="camera-icon"
                  onClick={handleUpdateAvatar}
                  title="Cập nhật ảnh đại diện"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                Click vào ảnh để xem lớn, click vào <FaCamera /> để cập nhật
              </div>
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
            <button className="close-button" onClick={() => setIsProfileOpen(false)}>
              X
            </button>
          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {isAvatarModalOpen && (
        <div className="profile-modal" onClick={() => setIsAvatarModalOpen(false)}>
          <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
            <img
              src={`${API_URL}${user?.image || "/default-avatar.png"}`}
              alt="Avatar Large"
              style={{ maxWidth: 500, maxHeight: 500, borderRadius: 10 }}
            />
            <button className="close-button" onClick={() => setIsAvatarModalOpen(false)}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;