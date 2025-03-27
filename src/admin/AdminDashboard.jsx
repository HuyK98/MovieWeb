import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../assets/logo.jpg";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);
  const toggleMoviesMenu = () => {
    setIsMoviesOpen(!isMoviesOpen);
  };


  return (
    <div className="admin-dashboard">
      <div className='sidebar_blog_1'>
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className='sidebar_blog_2'>
        <Link to="/admin"><h4>General</h4></Link>
        <ul className='sider-blog-2'>
        <li>
            <div onClick={toggleMoviesMenu} className="menu-item">
              Quản lý phim {isMoviesOpen ? '▲' : '▼'}
            </div>
            {isMoviesOpen && (
              <ul className="submenu">
                <li><Link to="/admin/movies">Danh sách phim</Link></li>
                <li><Link to="/admin/add-movie">Thêm phim</Link></li>
                <li><Link to="/admin/movie-details">Xem chi tiết phim</Link></li>
                <li><Link to="/admin/add-showtime">Thêm thời gian chiếu</Link></li>
              </ul>
            )}
          </li>
          <li><Link to="/admin/schedules">Quản lý lịch chiếu</Link></li>
          <li><Link to="/admin/genres">Quản lý thể loại phim</Link></li>
          <li><Link to="/admin/users">Quản lý người dùng</Link></li>
          <li><Link to="/admin/tickets">Quản lý vé</Link></li>
          <li><Link to="/admin/rooms">Quản lý phòng chiếu</Link></li>
          <li><Link to="/admin/revenue">Quản lý doanh thu</Link></li>
          <li><Link to="/logout">Đăng xuất</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;