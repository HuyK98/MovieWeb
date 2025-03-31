import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FaFilm, FaUser, FaTicketAlt, FaChartLine, FaSignOutAlt, FaCogs } from "react-icons/fa";
import { MdSchedule, MdTheaters, MdCategory, MdOutlineAddCircle, MdRemoveRedEye } from "react-icons/md";
import axios from "axios";
import moment from "moment";
import "../styles/BillsManage.css";

const BillsManage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [editingBill, setEditingBill] = useState(null);

  const editBill = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/bills/${id}`, updatedData);
      if (response.status === 200) {
        setBills(bills.map((bill) => (bill._id === id ? response.data.bill : bill)));
        alert('Hóa đơn đã được cập nhật thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi sửa hóa đơn:', error);
      alert('Lỗi khi sửa hóa đơn.');
    }
  };

  const deleteBill = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/bills/${id}`);
      if (response.status === 200) {
        setBills(bills.filter((bill) => bill._id !== id)); // Cập nhật danh sách hóa đơn sau khi xóa
        alert('Hóa đơn đã được xóa thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa hóa đơn:', error);
      alert('Lỗi khi xóa hóa đơn.');
    }
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bills");
        setBills(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách hóa đơn.");
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  if (loading) {
    return <p>Đang tải danh sách hóa đơn...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="admin-bills-container">
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
      <table className="admin-bills-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên khách hàng</th>
            <th>Email</th>
            <th>Phim</th>
            <th>Ngày chiếu</th>
            <th>Ghế</th>
            <th>Tổng tiền</th>
            <th>Phương thức</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, index) => (
            <tr key={bill._id}>
              <td>{index + 1}</td>
              <td>{bill.user.name}</td>
              <td>{bill.user.email}</td>
              <td>{bill.movie.title}</td>
              <td>{moment(bill.booking.date).format("DD/MM/YYYY")}</td>
              <td>{bill.booking.seats.join(", ")}</td>
              <td>{bill.booking.totalPrice.toLocaleString()} VND</td>
              <td>{bill.booking.paymentMethod}</td>
              <td>{moment(bill.createdAt).format("DD/MM/YYYY HH:mm")}</td>
              <td>
                <button onClick={() => deleteBill(bill._id)} className="delete-button">Xóa</button>
                <button
                  onClick={() => setEditingBill(bill)}
                  className="edit-button"
                >
                  Sửa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form chỉnh sửa hóa đơn */}
      {editingBill && (
        <div className="edit-form-container">
          <h3>Chỉnh sửa hóa đơn</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editBill(editingBill._id, editingBill);
              setEditingBill(null);
            }}
          >
            <label>
              Tên khách hàng:
              <input
                type="text"
                value={editingBill.user.name}
                onChange={(e) =>
                  setEditingBill({
                    ...editingBill,
                    user: { ...editingBill.user, name: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={editingBill.user.email}
                onChange={(e) =>
                  setEditingBill({
                    ...editingBill,
                    user: { ...editingBill.user, email: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Ngày chiếu:
              <input
                type="date"
                value={moment(editingBill.booking.date).format("YYYY-MM-DD")}
                onChange={(e) =>
                  setEditingBill({
                    ...editingBill,
                    booking: { ...editingBill.booking, date: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Ghế:
              <input
                type="text"
                value={editingBill.booking.seats.join(", ")}
                onChange={(e) =>
                  setEditingBill({
                    ...editingBill,
                    booking: {
                      ...editingBill.booking,
                      seats: e.target.value.split(",").map((seat) => seat.trim()),
                    },
                  })
                }
              />
            </label>
            <label>
              Tổng tiền:
              <input
                type="number"
                value={editingBill.booking.totalPrice}
                onChange={(e) =>
                  setEditingBill({
                    ...editingBill,
                    booking: { ...editingBill.booking, totalPrice: e.target.value },
                  })
                }
              />
            </label>
            <label>
              Phương thức thanh toán:
              <input
                type="text"
                value={editingBill.booking.paymentMethod}
                onChange={(e) =>
                  setEditingBill({
                    ...editingBill,
                    booking: { ...editingBill.booking, paymentMethod: e.target.value },
                  })
                }
              />
            </label>
            <button type="submit" className="save-button">Lưu</button>
            <button
              type="button"
              onClick={() => setEditingBill(null)}
              className="cancel-button"
            >
              Hủy
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
export default BillsManage;