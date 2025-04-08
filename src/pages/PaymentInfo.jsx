import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/PaymentInfo.css';
import logo from "../assets/logo.jpg";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import momoIcon from "../assets/momo.ico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "../pages/LanguageContext"; // Thêm import
import vietnamFlag from "../assets/poster/Vietnam.jpg"; // Thêm cờ Việt Nam
import englandFlag from "../assets/poster/england-flag.png"; // Thêm cờ Anh
import translations from "../pages/translations";

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
  const { language, toggleLanguage } = useLanguage(); // Thêm useLanguage
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
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
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
        console.error('Error fetching user info:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          console.error('Request data:', error.request);
        } else {
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
          window.location.href = momoResponse.data.payUrl;
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
        alert(translations[language].paymentSuccess);
        navigate('/');
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert(translations[language].paymentFailed);
    }
  };

  return (
    <div className={`payment-movie-container ${darkMode ? "dark-mode" : ""}`}>
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        toggleLanguage={toggleLanguage} // Truyền toggleLanguage nếu Header cần
        language={language} // Truyền language nếu Header cần
      />
      <div className="payment-movie-container">
        <div className="payment-info-container">
          <h2>{translations[language].paymentInfoTitle}</h2>
          <div className="payment-details">
            <div className="form-group">
              <label>{translations[language].fullNameLabel}: {user.name}</label>
            </div>
            <div className="form-group">
              <label>{translations[language].phoneLabel}: {user.phone}</label>
            </div>
            <div className="form-group">
              <label>{translations[language].emailLabel}: {user.email}</label>
            </div>
            <div className="form-group">
              <p><strong>{translations[language].seatsLabel}:</strong> {selectedSeats.join(', ')}</p>
              <p><strong>{translations[language].totalPriceLabel}:</strong> {totalPrice.toLocaleString()} {translations[language].vnd}</p>
            </div>
            <div className="form-group">
              <label>{translations[language].paymentMethodLabel}:</label>
              <div className="payment-methods">
                <label>
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  {translations[language].cashOption}
                </label>
                <label>
                  <input
                    type="radio"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <img className="momo-icon" src={momoIcon} alt="MoMo" />
                  {translations[language].momoOption}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="movie-info">
          <h2>{translations[language].movieInfoTitle}</h2>
          <img src={bookingInfo.imageUrl} alt={bookingInfo.movieTitle} />
          <div className="details">
            <p><strong>{translations[language].movieTitleLabel}:</strong> {bookingInfo.movieTitle}</p>
            <p><strong>{translations[language].genreLabel}:</strong> {bookingInfo.genre}</p>
            <p><strong>{translations[language].durationLabel}:</strong> {bookingInfo.description}</p>
            <p><strong>{translations[language].cinemaLabel}:</strong> {bookingInfo.cinema}</p>
            <p><strong>{translations[language].showDateLabel}:</strong> {bookingInfo.date}</p>
            <p><strong>{translations[language].showTimeLabel}:</strong> {bookingInfo.time}</p>
          </div>
          <div className="button-container">
            <button className="booking-btn" onClick={() => navigate(-1)}>{translations[language].backButton}</button>
            <button className="booking-btn" onClick={handlePayment}>{translations[language].payButton}</button>
          </div>
        </div>
      </div>
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} language={language} /> {/* Truyền language nếu Footer cần */}
    </div>
  );
};

export default PaymentInfo;