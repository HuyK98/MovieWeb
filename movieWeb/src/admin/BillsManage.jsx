import React, { useState, useEffect } from "react";
import {
  FaBars,
} from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import "../styles_admin/BillsManage.css";
import API_URL from "../api/config"; // Import API_URL từ file config
import HeaderAdmin from "./admin_layout/HeaderAdmin";
import Sidebar from "./admin_layout/Sidebar";

const BillsManage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State để quản lý trạng thái collapse

  const editBill = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/bills/${id}`,
        updatedData
      );
      if (response.status === 200) {
        setBills(
          bills.map((bill) => (bill._id === id ? response.data.bill : bill))
        );
        alert("Hóa đơn đã được cập nhật thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi sửa hóa đơn:", error);
      alert("Lỗi khi sửa hóa đơn.");
    }
  };

  const deleteBill = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/bills/${id}`);
      if (response.status === 200) {
        setBills(bills.filter((bill) => bill._id !== id)); // Cập nhật danh sách hóa đơn sau khi xóa
        alert("Hóa đơn đã được xóa thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
      alert("Lỗi khi xóa hóa đơn.");
    }
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/bills`);
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
      <div className="admin-bills-container">
        <h2 className="admin-bills-title">Quản lý hóa đơn</h2>
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
                  <button
                    onClick={() => deleteBill(bill._id)}
                    className="delete-button"
                  >
                    Xóa
                  </button>
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
      </div>

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
                      seats: e.target.value
                        .split(",")
                        .map((seat) => seat.trim()),
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
                    booking: {
                      ...editingBill.booking,
                      totalPrice: e.target.value,
                    },
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
                    booking: {
                      ...editingBill.booking,
                      paymentMethod: e.target.value,
                    },
                  })
                }
              />
            </label>
            <button type="submit" className="save-button">
              Lưu
            </button>
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
};
export default BillsManage;
