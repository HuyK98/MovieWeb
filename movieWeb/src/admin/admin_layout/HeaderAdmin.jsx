import React, { useContext } from "react";
import NotificationPopup from "../components/NotificationPopup";
import MessagesIcon from "../components/MessagesIcon";
import ProfileAdmin from "../components/ProfileAdmin";
import "../../styles_admin/HeaderAdmin.css";
import { AdminContext } from "../../services/AdminContext";
import API_URL from "../../api/config";


const HeaderAdmin = () => {
  const { user } = useContext(AdminContext); // Lấy thông tin người dùng từ AdminContext

  return (
    <header className="header-admin">
      <div className="header-left">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="header-right">
        <NotificationPopup API_URL={API_URL} />
        <MessagesIcon />
        <ProfileAdmin user={user} />
      </div>
    </header>
  );
};

export default HeaderAdmin;
