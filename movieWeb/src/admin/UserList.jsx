import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBars,
} from "react-icons/fa";
import "../styles_admin/UserList.css";
import API_URL from "../api/config";
import HeaderAdmin from "./admin_layout/HeaderAdmin";
import Sidebar from "./admin_layout/Sidebar";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState("");
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State để quản lý trạng thái collapse

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo")).token
          : null;
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`${API_URL}/api/auth/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPhone(user.phone);
    setEditRole(user.role);
  };

  const handleSaveUser = async () => {
    try {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.put(
        `${API_URL}/api/auth/users/${editUser._id}`,
        {
          name: editName,
          email: editEmail,
          phone: editPhone,
          role: editRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(
        users.map((user) => (user._id === editUser._id ? response.data : user))
      );
      setEditUser(null);
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa người dùng:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`${API_URL}/api/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Người dùng đã được xóa thành công!");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      alert("Có lỗi xảy ra!");
    }
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

      <div className="user-list">
        <h2>Quản lý người dùng</h2>
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{users.indexOf(user) + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEditUser(user)}>
                      Chỉnh sửa
                    </button>
                    <button onClick={() => handleDeleteUser(user._id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editUser && (
          <div className="edit-user-form">
            <h3>Chỉnh sửa người dùng</h3>
            <label>
              Tên:
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </label>
            <label>
              Vai trò:
              <input
                type="text"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              />
            </label>
            <button onClick={handleSaveUser}>Lưu</button>
            <button onClick={() => setEditUser(null)}>Hủy</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
