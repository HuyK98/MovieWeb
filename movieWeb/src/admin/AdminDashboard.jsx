import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaFilm, FaUser, FaTicketAlt, FaChartLine, FaSignOutAlt, FaCogs } from "react-icons/fa";
import { MdSchedule, MdTheaters, MdCategory, MdOutlineAddCircle, MdRemoveRedEye } from "react-icons/md";
import logo from "../assets/logo.jpg";
import "../styles/AdminDashboard.css";
import Chat from "./Chat";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <ul className="menu">
          <li>
            <Link to="/admin" className="menu-item">
              <FaCogs className="icon" /> General
            </Link>
          </li>

          <li>
            <div onClick={() => setIsMoviesOpen(!isMoviesOpen)} className="menu-item">
              <FaFilm className="icon" /> Quản lý phim {isMoviesOpen ? "▲" : "▼"}
            </div>
            {isMoviesOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/admin/movies"><MdRemoveRedEye className="icon-sub" /> Danh sách phim</Link>
                </li>
                <li>
                  <Link to="/admin/add-movie"><MdOutlineAddCircle className="icon-sub" /> Thêm phim</Link>
                </li>
                <li>
                  <Link to="/admin/movie-detail"><MdTheaters className="icon-sub" /> Xem chi tiết phim</Link>
                </li>
                <li>
                  <Link to="/admin/add-showtime"><MdSchedule className="icon-sub" /> Thêm lịch chiếu</Link>
                </li>
                <li>
                  <Link to="/admin/chat" className="menu-item"><FaUser className="icon" /> Chat với người dùng</Link>
                </li>
              </ul>
            )}
          </li>

          <li><Link to="/admin/schedules" className="menu-item"><MdSchedule className="icon" /> Quản lý lịch chiếu</Link></li>
          <li><Link to="/admin/genres" className="menu-item"><MdCategory className="icon" /> Quản lý thể loại phim</Link></li>
          <li><Link to="/admin/users" className="menu-item"><FaUser className="icon" /> Quản lý người dùng</Link></li>
          <li><Link to="/admin/tickets" className="menu-item"><FaTicketAlt className="icon" /> Quản lý vé</Link></li>
          <li><Link to="/admin/revenue" className="menu-item"><FaChartLine className="icon" /> Quản lý doanh thu</Link></li>
          <li><Link to="/logout" className="menu-item logout"><FaSignOutAlt className="icon" /> Đăng xuất</Link></li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="dashboard-content">
        <h1>Welcom to Admin Dashboard</h1>
      </main>
      <Chat />
    </div>
  );
};

export default AdminDashboard;
