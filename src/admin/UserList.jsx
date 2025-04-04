import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaFilm, FaUser, FaTicketAlt, FaChartLine, FaSignOutAlt, FaCogs } from "react-icons/fa";
import { MdSchedule, MdTheaters, MdCategory, MdOutlineAddCircle, MdRemoveRedEye } from "react-icons/md";
import "../styles/UserList.css";
import logo from "../assets/logo.jpg";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState('');
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
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
      const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put(`http://localhost:5000/api/auth/users/${editUser._id}`, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        role: editRole,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(users.map((user) => (user._id === editUser._id ? response.data : user)));
      setEditUser(null);
    } catch (error) {
      console.error('Lỗi khi chỉnh sửa người dùng:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
      if (!token) {
        throw new Error('No token found');
      }

      await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Người dùng đã được xóa thành công!');
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      alert('Có lỗi xảy ra!');
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
                    <button onClick={() => handleEditUser(user)}>Chỉnh sửa</button>
                    <button onClick={() => handleDeleteUser(user._id)}>Xóa</button>
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