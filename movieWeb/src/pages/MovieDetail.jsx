import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../styles/MovieDetail.css';
import logo from "../assets/logo.jpg";
import axios from 'axios';
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

const MovieDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingInfo } = location.state || {};

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        if (!bookingInfo || !bookingInfo.movieTitle || !bookingInfo.date || !bookingInfo.time) {
          console.error('bookingInfo hoặc các trường cần thiết là undefined');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/payment/seats', {
          params: {
            movieTitle: bookingInfo.movieTitle,
            date: bookingInfo.date,
            time: bookingInfo.time,
          },
        });
        const bookedSeats = response.data;
        const allSeats = Array.from({ length: 70 }, (_, i) => ({
          id: i + 1,
          isBooked: bookedSeats.includes((i + 1).toString()),
        }));
        setSeats(allSeats);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin ghế:', error);
      }
    };

    fetchSeats();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, [bookingInfo]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    const isSelected = selectedSeats.includes(seat.id);
    const updatedSelectedSeats = isSelected
      ? selectedSeats.filter((id) => id !== seat.id)
      : [...selectedSeats, seat.id];

    setSelectedSeats(updatedSelectedSeats);
    setTotalPrice(updatedSelectedSeats.length * 50000); // 50,000 VND per seat
  };

  const handleBooking = () => {
    navigate('/payment', { state: { bookingInfo, selectedSeats, totalPrice } });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className={`movie-detail-container ${darkMode ? "dark-mode" : ""}`}>
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

      <div className="movie-detail-container">
        <div className="content">
          <p className="map-seats">SƠ ĐỒ GHẾ NGỒI</p>
          <div className="seating-chart">
            <div className="screen">Màn hình chiếu</div>
            <div className="seats">
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${seat.isBooked ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : 'available'}`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.id}
                </div>
              ))}
            </div>
          </div>
          <div className="movie-info">
            <h2>Thông tin chi tiết về phim</h2>
            {bookingInfo && (
              <>
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
              </>
            )}
            <button className="button-btn" type="button" onClick={handleBooking}>Tiếp tục</button>
          </div>
          <div className="legend">
            <div className="available">
              <span></span> <p>Ghế trống</p>
            </div>
            <div className="selected">
              <span></span> <p>Ghế đang chọn</p>
            </div>
            <div className="booked">
              <span></span> <p>Ghế đã đặt</p>
            </div>
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
              <li>Cinema Nguyễn Trãi, TP. Hồ Chí Minh - Hotline: 070 675 509</li>
              <li>Cinema Quang Trung, TP. Hồ Chí Minh - Hotline: 090 123 456</li>
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

export default MovieDetail;