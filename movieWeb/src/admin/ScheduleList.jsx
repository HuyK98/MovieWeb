import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBars,
} from "react-icons/fa";
import "../styles_admin/ScheduleList.css";
import API_URL from "../api/config";
import HeaderAdmin from "./admin_layout/HeaderAdmin";
import Sidebar from "./admin_layout/Sidebar";

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
        const response = await axios.get(`${API_URL}/api/showtimes`);
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
        `${API_URL}/api/showtimes/${showtimeId}/time`,
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
        `${API_URL}/api/showtimes/${showtimeId}/time/${timeId}`,
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
        `${API_URL}/api/showtimes/${showtimeId}/time/${timeId}`
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
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <HeaderAdmin />
      <button
        className="collapse-button"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <FaBars />
      </button>
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
