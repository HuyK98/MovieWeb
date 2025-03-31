import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/PaymentInfo.css';
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import momoIcon from "../assets/momo.ico";
import moment from "moment";
const PaymentInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingInfo, selectedSeats, totalPrice } = location.state || {};
  const [user, setUser] = useState({ name: '', phone: '', email: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
      const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
      if (!token) {
        throw new Error('No token found');
      }

      if (!paymentMethod) {
        alert('Vui lòng chọn phương thức thanh toán!');
        return;
      }

      let bookingData = {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        movie: {
          title: bookingInfo.movieTitle,
          imageUrl: bookingInfo.imageUrl,
          releaseDate: bookingInfo.releaseDate,
          genre: bookingInfo.genre,
        },
        booking: {
          date: bookingInfo.date,
          seats: selectedSeats,
          totalPrice: totalPrice,
          paymentMethod: paymentMethod,
        },
      };

      if (paymentMethod === 'momo') {
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
          // Lưu thông tin vé vào localStorage
          const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
          localStorage.setItem('bookings', JSON.stringify([...storedBookings, bookingData]));

          window.location.href = momoResponse.data.payUrl; // Redirect to MoMo payment page
          return;
        } else {
          throw new Error('MoMo payment failed');
        }
      } else {
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

        // Lưu thông tin vé vào localStorage
        const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
        localStorage.setItem('bookings', JSON.stringify([...storedBookings, bookingData]));

        alert('Thanh toán thành công!');
        navigate('/');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      alert('Thanh toán thất bại. Vui lòng thử lại.');
    }
  };

  
  //scroll header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        isScrolled={isScrolled}
      />
      <div className='home-content'>
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
                <p><strong>Ghế ngồi:</strong> {selectedSeats.join(', ')}</p>
                <p><strong>Tổng tiền:</strong> {totalPrice.toLocaleString()} VND</p>
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
              <p><strong>Ngày chiếu:</strong> {moment(bookingInfo.date).format('DD/MM/YYYY')}</p>
              <p><strong>Giờ chiếu:</strong> {bookingInfo.time}</p>
            </div>
            <div className="button-container">
              <button className="booking-btn" onClick={() => navigate(-1)}>Quay lại</button>
              <button className="booking-btn" onClick={handlePayment}>Thanh toán</button>
            </div>
          </div>
        </div>
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default PaymentInfo;