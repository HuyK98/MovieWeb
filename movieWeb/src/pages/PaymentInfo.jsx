import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/PaymentInfo.css';
import logo from "../assets/logo.jpg";
import momoIcon from "../assets/momo.ico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faYoutube,
  faTiktok,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const PaymentInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingInfo, selectedSeats, totalPrice } = location.state || {};
  const [user, setUser] = useState({ name: '', phone: '', email: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  useEffect(() => {
    // Lấy thông tin người dùng từ endpoint
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null; // Lấy token từ localStorage
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        if (error.response) {
          // Request made and server responded
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          // Request made but no response received
          console.error('Request data:', error.request);
        } else {
          // Something happened in setting up the request
          console.error('Error message:', error.message);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null; // Lấy token từ localStorage
      if (!token) {
        throw new Error('No token found');
      }

      if (paymentMethod === 'momo') {
        // Xử lý thanh toán qua ví MoMo
        const momoResponse = await axios.post('http://localhost:5000/api/payment/momo', {
          bookingInfo,
          selectedSeats,
          totalPrice,
          paymentMethod,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (momoResponse.data && momoResponse.data.payUrl) {
          window.location.href = momoResponse.data.payUrl; // Redirect to MoMo payment page
          return;
        } else {
          throw new Error('MoMo payment failed');
        }
      } else {
        // Xử lý thanh toán thông thường
        const response = await axios.post('http://localhost:5000/api/payment/pay', {
          bookingInfo,
          selectedSeats,
          totalPrice,
          paymentMethod,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Thanh toán thành công!');
        navigate('/');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Thanh toán thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div>
      <header>
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <nav>
          <ul>
            <li><Link to="/showtimes">LỊCH CHIẾU THEO RẠP</Link></li>
            <li><Link to="/movielist">PHIM</Link></li>
            <li><Link to="/place">RẠP</Link></li>
            <li><Link to="/about">GIÁ VÉ</Link></li>
            <li><Link to="/news">TIN MỚI VÀ ƯU ĐÃI</Link></li>
            {user ? (
              <>
                <li><span>Xin chào, {user.name}</span></li>
                <li><button onClick={handleLogout}>Đăng xuất</button></li>
              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
          </ul>
        </nav>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </header>
      <div className="payment-movie-container">
        <div className="payment-info-container">
          <h2>Thông tin thanh toán</h2>
          <div className="payment-details">
            <div className="form-group">
              <label>Họ tên: {user.name}</label>
            </div>
            <div className="form-group">
              <label>Số điện thoại: {user.phone}</label>
            </div>
            <div className="form-group">
              <label>Email: {user.email}</label>
            </div>
            <div className="form-group">
              <label>Phương thức thanh toán:</label>
              <div className="payment-methods">
                <label>
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Tiền mặt
                </label>
                <label>
                  <input
                    type="radio"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <img className="momo-icon" src={momoIcon} alt="MOMO" />
                  Ví MOMO
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="movie-info">
          <h2>Thông tin chi tiết về phim</h2>
          <img src={bookingInfo.imageUrl} alt={bookingInfo.movieTitle} />
          <div className="details">
            <p><strong>Tên phim:</strong> {bookingInfo.movieTitle}</p>
            <p><strong>Thể loại:</strong> {bookingInfo.genre}</p>
            <p><strong>Thời lượng:</strong> {bookingInfo.description}</p>
            <p><strong>Rạp chiếu:</strong> {bookingInfo.cinema}</p>
            <p><strong>Ngày chiếu:</strong> {bookingInfo.date}</p>
            <p><strong>Giờ chiếu:</strong> {bookingInfo.time}</p>
            <p><strong>Ghế ngồi:</strong> {selectedSeats.join(', ')}</p>
            <p><strong>Tổng tiền:</strong> {totalPrice.toLocaleString()} VND</p>
          </div>
          <div className="button-container">
            <button className="button-btn" onClick={() => navigate(-1)}>Quay lại</button>
            <button className="button-btn" onClick={handlePayment}>Thanh toán</button>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section left">
            <h3>CÁC RẠP Cinema</h3>
            <ul>
              <li>Cinema Xuân Thủy, Hà Nội - Hotline: 033 023 183</li>
              <li>Cinema Tây Sơn, Hà Nội - Hotline: 097 694 713</li>
              <li>
                Cinema Nguyễn Trãi, TP. Hồ Chí Minh - Hotline: 070 675 509
              </li>
              <li>
                Cinema Quang Trung, TP. Hồ Chí Minh - Hotline: 090 123 456
              </li>
              <li>Cinema Đống Đa, Hà Nội - Hotline: 098 765 432</li>
              <li>Cinema Cầu Giấy, Hà Nội - Hotline: 098 765 432</li>
            </ul>
          </div>
          <div className="footer-section center">
            <Link to="/">
              <img src={logo} alt="Logo" className="logo" />
            </Link>
            <p>© 2021 Cinema Media. All Rights Reserved</p>
            <button className="toggle-button" onClick={toggleDarkMode}>
              {darkMode ? (
                <FontAwesomeIcon icon={faSun} />
              ) : (
                <FontAwesomeIcon icon={faMoon} />
              )}
              {darkMode ? " Light Mode" : " Dark Mode"}
            </button>
          </div>
          <div className="footer-section right">
            <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
            <div className="social-links">
              <a href="#" className="facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="youtube">
                <FontAwesomeIcon icon={faYoutube} />
              </a>
              <a href="#" className="tiktok">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a href="#" className="instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
            <h3>LIÊN HỆ</h3>
            <p>CÔNG TY CỔ PHẦN CINEMA MEDIA</p>
            <p>Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
            <p>Hotline: 1800 123 456</p>
            <p>Email: info@cinemamedia.vn</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentInfo;