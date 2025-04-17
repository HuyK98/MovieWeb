import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaFilm,
  FaUser,
  FaTicketAlt,
  FaChartLine,
  FaSignOutAlt,
  FaCogs,
} from "react-icons/fa";
import {
  MdSchedule,
  MdTheaters,
  MdCategory,
  MdOutlineAddCircle,
  MdRemoveRedEye,
} from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/logo.jpg";

const Sidebar = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);

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
    <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-admin" />
        </Link>
      </div>

      <ul className="menu">
        <li>
          <Link
            to="/admin"
            className={`menu-item ${
              location.pathname === "/admin" ? "active" : ""
            }`}
          >
            <FaCogs className="icon" />
            {!isSidebarCollapsed && "General"}
          </Link>
        </li>

        <li>
          <div
            onClick={() => setIsMoviesOpen(!isMoviesOpen)}
            className={`menu-item ${isMoviesOpen ? "active" : ""}`}
          >
            <FaFilm className="icon" />
            {!isSidebarCollapsed &&
              `Quản lý phim ${isMoviesOpen ? "▲" : "▼"}`}
          </div>
          {isMoviesOpen && (
            <ul className="submenu">
              <li>
                <Link
                  to="/admin/movies"
                  className={`submenu-item ${
                    location.pathname === "/admin/movies" ? "active" : ""
                  }`}
                >
                  <MdRemoveRedEye className="icon-sub" />
                  {!isSidebarCollapsed && "Danh sách phim"}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/add-movie"
                  className={`submenu-item ${
                    location.pathname === "/admin/add-movie" ? "active" : ""
                  }`}
                >
                  <MdOutlineAddCircle className="icon-sub" />
                  {!isSidebarCollapsed && "Thêm phim"}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/movie-detail"
                  className={`submenu-item ${
                    location.pathname === "/admin/movie-detail"
                      ? "active"
                      : ""
                  }`}
                >
                  <MdTheaters className="icon-sub" />
                  {!isSidebarCollapsed && "Xem chi tiết phim"}
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/chat"
                  className={`submenu-item ${
                    location.pathname === "/admin/chat" ? "active" : ""
                  }`}
                >
                  <FaUser className="icon" />
                  {!isSidebarCollapsed && "Chat với người dùng"}
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link
            to="/admin/schedules"
            className={`menu-item ${
              location.pathname === "/admin/schedules" ? "active" : ""
            }`}
          >
            <MdSchedule className="icon" />
            {!isSidebarCollapsed && "Quản lý lịch chiếu"}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/genres"
            className={`menu-item ${
              location.pathname === "/admin/genres" ? "active" : ""
            }`}
          >
            <MdCategory className="icon" />
            {!isSidebarCollapsed && "Quản lý thể loại phim"}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/users"
            className={`menu-item ${
              location.pathname === "/admin/users" ? "active" : ""
            }`}
          >
            <FaUser className="icon" />
            {!isSidebarCollapsed && "Quản lý người dùng"}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/tickets"
            className={`menu-item ${
              location.pathname === "/admin/tickets" ? "active" : ""
            }`}
          >
            <FaTicketAlt className="icon" />
            {!isSidebarCollapsed && "Quản lý vé"}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/bills"
            className={`menu-item ${
              location.pathname === "/admin/bills" ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="icon" />
            {!isSidebarCollapsed && "Quản lý hóa đơn"}
          </Link>
        </li>
        <li>
          <Link
            to="/admin/revenue"
            className={`menu-item ${
              location.pathname === "/admin/revenue" ? "active" : ""
            }`}
          >
            <FaChartLine className="icon" />
            {!isSidebarCollapsed && "Quản lý doanh thu"}
          </Link>
        </li>
        <li>
          <Link
            to="/logout"
            className={`menu-item logout ${
              location.pathname === "/logout" ? "active" : ""
            }`}
          >
            <FaSignOutAlt className="icon" />
            {!isSidebarCollapsed && "Đăng xuất"}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;