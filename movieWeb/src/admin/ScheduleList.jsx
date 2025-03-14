import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaCogs, FaFilm, FaUser, FaTicketAlt, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import { MdRemoveRedEye, MdOutlineAddCircle, MdTheaters, MdSchedule, MdCategory } from "react-icons/md";
import "../styles/ScheduleList.css";
import logo from "../assets/logo.jpg";

const ScheduleList = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [newTime, setNewTime] = useState("");
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);

  const toggleMoviesMenu = () => {
    setIsMoviesOpen(!isMoviesOpen);
  };

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
    try {
      const response = await axios.put(
        `http://localhost:5000/api/showtimes/${showtimeId}/time/${timeId}`,
        {
          time: newTime,
          seats: 70, // Mặc định số ghế là 70
        }
      );
      alert("Giờ chiếu đã được chỉnh sửa thành công!");
      setShowtimes(
        showtimes.map((st) => (st._id === showtimeId ? response.data : st))
      );
      setNewTime("");
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
                  <td>{showtime.movieId.title}</td>
                  <td>{showtime.date}</td>
                  <td>
                    <ul>
                      {showtime.times.map((time) => (
                        <li key={time._id}>
                          {time.time}
                          <button
                            onClick={() => handleEditTime(showtime._id, time._id)}
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleDeleteTime(showtime._id, time._id)}
                          >
                            Xóa
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
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