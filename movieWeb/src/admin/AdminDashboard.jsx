import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles_admin/AdminDashboard.css";
import Chat from "./Chat";
import { FaBars } from "react-icons/fa";
import HeaderAdmin from "./admin_layout/HeaderAdmin";
import Sidebar from "./admin_layout/Sidebar";
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State để quản lý trạng thái collapse

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Kiểm tra nếu `location.pathname` thuộc submenu "Quản lý phim"
  useEffect(() => {
    if (
      location.pathname === "/admin/movies" ||
      location.pathname === "/admin/add-movie" ||
      location.pathname === "/admin/movie-detail" ||
      location.pathname === "/admin/chat"
    ) {
      setIsMoviesOpen(true); // Giữ trạng thái mở
    }
  }, [location.pathname]);

  return (
    <div className={`admin-dashboard ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <HeaderAdmin />
      <button
        className="collapse-button"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <FaBars />
      </button>
      {/* Sidebar */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <Chat />
    </div>
  );
};

export default AdminDashboard;