import React, { useState, useContext } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../services/AdminContext";

const ProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AdminContext); // Lấy thông tin người dùng từ AdminContext

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div>
      <div className="profile-container" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <img
          src={`${user?.image || "/default-avatar.png"}`}
          alt="Admin Avatar"
          className="profile-image"
        />
        <span className="profile-name">{user?.name || "Admin"}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => navigate("/admin/profile")}>
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
  );
};

export default ProfileDropdown;