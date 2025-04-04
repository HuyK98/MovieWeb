import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../styles/MovieDetail.css';
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import logo from "../assets/logo.jpg";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "../pages/LanguageContext"; // Thêm import
import vietnamFlag from "../assets/poster/Vietnam.jpg"; // Thêm cờ Việt Nam
import englandFlag from "../assets/poster/england-flag.png"; // Thêm cờ Anh
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
import moment from 'moment';

const MovieDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingInfo } = location.state || {};
  const { language, toggleLanguage } = useLanguage(); // Thêm useLanguage

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  const texts = {
    vi: {
      showtimes: "LỊCH CHIẾU THEO RẠP",
      movies: "PHIM",
      theaters: "RẠP",
      ticketPrices: "GIÁ VÉ",
      news: "TIN MỚI VÀ ƯU ĐÃI",
      searchPlaceholder: "Tìm kiếm phim...",
      login: "Đăng nhập",
      logout: "Đăng xuất",
      hello: "Xin chào",
      seatingChart: "SƠ ĐỒ GHẾ NGỒI",
      screen: "Màn hình chiếu",
      seatsLabel: "Ghế ngồi",
      totalPriceLabel: "Tổng tiền",
      movieInfoTitle: "Thông tin chi tiết về phim",
      movieTitleLabel: "Tên phim",
      genreLabel: "Thể loại",
      durationLabel: "Thời lượng",
      cinemaLabel: "Rạp chiếu",
      showDateLabel: "Ngày chiếu",
      showTimeLabel: "Giờ chiếu",
      backButton: "Quay lại",
      continueButton: "Tiếp tục",
      available: "Ghế trống",
      selected: "Ghế đang chọn",
      booked: "Ghế đã đặt",
      vnd: "VND",
    },
    en: {
      showtimes: "SHOWTIMES",
      movies: "MOVIES",
      theaters: "THEATERS",
      ticketPrices: "TICKET PRICES",
      news: "NEWS & PROMOTIONS",
      searchPlaceholder: "Search movies...",
      login: "Login",
      logout: "Logout",
      hello: "Hello",
      seatingChart: "SEATING CHART",
      screen: "Screen",
      seatsLabel: "Seats",
      totalPriceLabel: "Total Price",
      movieInfoTitle: "Movie Details",
      movieTitleLabel: "Movie Title",
      genreLabel: "Genre",
      durationLabel: "Duration",
      cinemaLabel: "Theater",
      showDateLabel: "Show Date",
      showTimeLabel: "Show Time",
      backButton: "Back",
      continueButton: "Continue",
      available: "Available",
      selected: "Selected",
      booked: "Booked",
      vnd: "VND",
    },
  };

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        if (!bookingInfo || !bookingInfo.movieTitle || !bookingInfo.date || !bookingInfo.time) {
          console.error('bookingInfo or required fields are undefined');
          return;
        }
        const formattedDate = moment(bookingInfo.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        const response = await axios.get('http://localhost:5000/api/payment/seats', {
          params: {
            movieTitle: bookingInfo.movieTitle,
            date: formattedDate,
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
        console.error('Error fetching seat info:', error);
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
    const formattedDate = moment(bookingInfo.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const updatedBookingInfo = { ...bookingInfo, date: formattedDate };
    navigate('/payment', { state: { bookingInfo: updatedBookingInfo, selectedSeats, totalPrice } });
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
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        toggleLanguage={toggleLanguage} // Truyền toggleLanguage nếu Header cần
        language={language} // Truyền language nếu Header cần
      />
      <div className="movie-detail-container">
        <div className="content">
          <p className="map-seats">{texts[language].seatingChart}</p>
          <div className="seating-chart">
            <div className="screen">{texts[language].screen}</div>
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
          <div className="booking-oder">
            <p><strong>{texts[language].seatsLabel}:</strong> {selectedSeats.join(', ')}</p>
            <p><strong>{texts[language].totalPriceLabel}:</strong> {totalPrice.toLocaleString()} {texts[language].vnd}</p>
          </div>
          <div className="movie-info">
            <h2>{texts[language].movieInfoTitle}</h2>
            {bookingInfo && (
              <>
                <img src={bookingInfo.imageUrl} alt={bookingInfo.movieTitle} />
                <div className="details">
                  <p><strong>{texts[language].movieTitleLabel}:</strong> {bookingInfo.movieTitle}</p>
                  <p><strong>{texts[language].genreLabel}:</strong> {bookingInfo.genre}</p>
                  <p><strong>{texts[language].durationLabel}:</strong> {bookingInfo.description}</p>
                  <p><strong>{texts[language].cinemaLabel}:</strong> {bookingInfo.cinema}</p>
                  <p><strong>{texts[language].showDateLabel}:</strong> {bookingInfo.date}</p>
                  <p><strong>{texts[language].showTimeLabel}:</strong> {bookingInfo.time}</p>
                </div>
              </>
            )}
            <div className="button-container">
              <button className='booking-btn' onClick={() => navigate('/')}>{texts[language].backButton}</button>
              <button className="booking-btn" type="button" onClick={handleBooking}>{texts[language].continueButton}</button>
            </div>
          </div>
          <div className="legend">
            <div className="available">
              <span></span> <p>{texts[language].available}</p>
            </div>
            <div className="selected">
              <span></span> <p>{texts[language].selected}</p>
            </div>
            <div className="booked">
              <span></span> <p>{texts[language].booked}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} language={language} /> {/* Truyền language nếu Footer cần */}
    </div>
  );
};

export default MovieDetail;