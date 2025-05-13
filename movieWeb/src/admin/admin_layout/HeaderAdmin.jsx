import React, { useContext } from "react";
import NotificationPopup from "../components/NotificationPopup";
import MessagesIcon from "../components/MessagesIcon";
import ProfileDropdown from "../components/ProfileDropdown";
import "../../styles/HeaderAdmin.css";
import { AdminContext } from "../../services/AdminContext";

const HeaderAdmin = () => {
  const { user } = useContext(AdminContext); // Lấy thông tin người dùng từ AdminContext

  return (
    <header className="header-admin">
      <div className="header-left">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="header-right">
        <NotificationPopup />
        <MessagesIcon />
        <ProfileDropdown user={user} />
      </div>
    </header>
  );
};

export default HeaderAdmin;
