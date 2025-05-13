import React, { useState, useContext } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../services/AdminContext";
import API_URL from "../../api/config"; // Import API_URL từ ApiConfig
import "../../styles/HeaderAdmin.css"; // Import CSS styles
const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Trạng thái mở/đóng thông tin profile
  const navigate = useNavigate();
  const { user } = useContext(AdminContext); // Lấy thông tin người dùng từ AdminContext

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div>
      {/* Dropdown toggle */}
      <div className="profile-container" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <img
          src={`${API_URL}${user?.image || "/default-avatar.png"}`}
          alt="Admin Avatar"
          className="profile-image"xx
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
              setIsProfileOpen(!isProfileOpen); // Toggle hiển thị thông tin profile
              setIsDropdownOpen(false); // Đóng menu dropdown
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
              <div className="upload-circle">
                <img
                  src={`${API_URL}${user?.image || "/default-avatar.png"}`}
                  alt="User Avatar"
                />
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
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;