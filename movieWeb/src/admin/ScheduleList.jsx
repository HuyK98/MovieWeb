import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaCogs,
  FaFilm,
  FaUser,
  FaTicketAlt,
  FaSignOutAlt,
  FaChartLine,
  FaBars,
} from "react-icons/fa";
import {
  MdRemoveRedEye,
  MdOutlineAddCircle,
  MdTheaters,
  MdSchedule,
  MdCategory,
} from "react-icons/md";
import "../styles/ScheduleList.css";
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const ScheduleList = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [newTime, setNewTime] = useState("");
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [editTimes, setEditTimes] = useState({});
  const toggleMoviesMenu = () => {
    setIsMoviesOpen(!isMoviesOpen);
  };
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State để quản lý trạng thái collapse

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/showtimes");
        setShowtimes(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy lịch chiếu:", error);
      }
    };
    fetchShowtimes();
  }, []);

  const handleAddTime = async (showtimeId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/showtimes/${showtimeId}/time`,
        {
          time: newTime,
          seats: 70, // Mặc định số ghế là 70
        }
      );
      alert("Giờ chiếu đã được thêm thành công!");
      setShowtimes(
        showtimes.map((st) => (st._id === showtimeId ? response.data : st))
      );
      setNewTime("");
    } catch (error) {
      console.error("Lỗi khi thêm giờ chiếu:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleEditTime = async (showtimeId, timeId) => {
    const timeToEdit = editTimes[timeId];
    if (!timeToEdit) {
      alert("Vui lòng nhập giờ chiếu mới");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/showtimes/${showtimeId}/time/${timeId}`,
        {
          time: timeToEdit,
          seats: 70, // Mặc định số ghế là 70
        }
      );
      alert("Giờ chiếu đã được chỉnh sửa thành công!");
      setShowtimes(
        showtimes.map((st) => (st._id === showtimeId ? response.data : st))
      );
      setEditTimes((prev) => ({ ...prev, [timeId]: "" }));
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa giờ chiếu:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleDeleteTime = async (showtimeId, timeId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/showtimes/${showtimeId}/time/${timeId}`
      );
      alert("Giờ chiếu đã được xóa thành công!");
      setShowtimes(
        showtimes.map((st) =>
          st._id === showtimeId
            ? { ...st, times: st.times.filter((t) => t._id !== timeId) }
            : st
        )
      );
    } catch (error) {
      console.error("Lỗi khi xóa giờ chiếu:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  //định ngày theo ngày Việt NamNam
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div className={`admin-dashboard ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <button
            className="collapse-button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <FaBars />
          </button>
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
      <div className="schedule-list">
        <h2>Quản lý lịch chiếu</h2>
        <div className="table-container">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Phim</th>
                <th>Ngày</th>
                <th>Giờ chiếu</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {showtimes.map((showtime) => (
                <tr key={showtime._id}>
                  <td>{showtimes.indexOf(showtime) + 1}</td>
                  <td>{showtime.movieId ? showtime.movieId.title : "N/A"}</td>
                  <td>{formatDate(showtime.date)}</td>
                  <td>
                    <ul>
                      {showtime.times.map((time) => (
                        <li key={time._id}>
                          {time.time}
                          <input
                            type="time"
                            value={editTimes[time._id] || ""}
                            onChange={(e) =>
                              setEditTimes((prev) => ({
                                ...prev,
                                [time._id]: e.target.value,
                              }))
                            }
                            placeholder="Giờ chiếu mới"
                          />
                          <button
                            onClick={() =>
                              handleEditTime(showtime._id, time._id)
                            }
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteTime(showtime._id, time._id)
                            }
                          >
                            Xóa
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="editdadd-times">
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="Giờ chiếu mới"
                    />
                    <button onClick={() => handleAddTime(showtime._id)}>
                      Thêm giờ chiếu
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
