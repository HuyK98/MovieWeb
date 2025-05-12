import React, { useEffect, useState } from "react";
import NotificationPopup from "../components/NotificationPopup";
import MessagesIcon from "../components/MessagesIcon";
import ProfileDropdown from "../components/ProfileDropdown";
import "../../styles/HeaderAdmin.css";
import API_URL from "../../api/config";
import axios from "axios";

const HeaderAdmin = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
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

    fetchUser();
  }, []);

  return (
    <header className="header-admin">
      <div className="header-left">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="header-right">
        <NotificationPopup API_URL={API_URL} />
        <MessagesIcon />
        <ProfileDropdown user={user} API_URL={API_URL} />
      </div>
    </header>
  );
};

export default HeaderAdmin;