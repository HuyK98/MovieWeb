import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Showtime.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/logo.jpg";
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

const Showtime = () => {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [movieShowtimes, setMovieShowtimes] = useState([]);

  // Added missing states from header/footer
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  const handleBuyTicketClick = async (movie) => {
    if (!movie._id) {
      console.error("Movie ID is undefined");
      return;
    }
    setSelectedMovie(movie);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/showtimes?movieId=${movie._id}`
      );
      setShowtimes(response.data);
      if (response.data.length > 0) {
        setSelectedShowtime(response.data[0]); // Tự động chọn ngày đầu tiên
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch chiếu:", error);
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeat(null);
    setBookingInfo(null);
  };

  const handleDateClick = (date) => {
    const showtimeForDate = showtimes.find((showtime) => showtime.date === date);
    setSelectedShowtime(showtimeForDate);
    setSelectedSeat(null);
  };

  const handleSeatClick = (showtime, timeSlot) => {
    setSelectedSeat(timeSlot);
    setBookingInfo({
      _id: selectedMovie._id,
      movieTitle: selectedMovie.title,
      imageUrl: selectedMovie.imageUrl,
      genre: selectedMovie.genre,
      description: selectedMovie.description,
      cinema: "Rạp CINEMA",
      date: formatDate(showtime.date),
      time: timeSlot.time,
      seat: timeSlot.seats,
      status: timeSlot.isBooked ? "Đã đặt" : "Ghế trống",
    });
  };

  const handleConfirmBooking = () => {
    const isLoggedIn = localStorage.getItem("userInfo");
    if (!isLoggedIn) {
      navigate("/login", { state: { bookingInfo } });
    } else {
      navigate("/movie-detail", { state: { bookingInfo } });
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fetch movie data and showtimes when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get movie list
        const moviesResponse = await axios.get("http://localhost:5000/api/movies");
        setMovies(moviesResponse.data);

        // Get all showtimes
        const showtimesResponse = await axios.get("http://localhost:5000/api/showtimes");
        setShowtimes(showtimesResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while loading data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data when selectedDate changes
  useEffect(() => {
    const processShowtimesData = () => {
      // Format selectedDate for easier comparison
      const formattedSelectedDate = selectedDate.toISOString().split('T')[0];

      // Filter showtimes for selected date and group by movieId
      const filteredShowtimes = showtimes.filter(showtime => {
        const showtimeDate = new Date(showtime.date).toISOString().split('T')[0];
        return showtimeDate === formattedSelectedDate;
      });

      // Map movie data with showtimes
      const moviesWithShowtimes = movies.map(movie => {
        // Find all showtimes for this movie on selected date
        const movieShowtimes = filteredShowtimes.filter(
          showtime => showtime.movieId && showtime.movieId._id === movie._id
        );

        return {
          ...movie,
          showtime: movieShowtimes
        };
      });

      // Only keep movies with showtimes on the selected date
      const moviesWithShowtimesToday = moviesWithShowtimes.filter(
        movie => movie.showtime && movie.showtime.length > 0
      );

      setMovieShowtimes(moviesWithShowtimesToday);
    };

    if (movies.length > 0 && showtimes.length > 0) {
      processShowtimesData();
    }
  }, [movies, showtimes, selectedDate]);

  // Create array of 7 days starting from today
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const getDayOfWeek = (date) => {
    return new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' });
  };

  const handleShowtimeClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };
  const closeModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  // Display loading screen while loading data
  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  // Display error message if any
  if (error) {
    return <div className="error">{error}</div>;
  }

  const dates = generateDates();

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
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

      <div className="movie-showtimes-container">
        <h1 className="page-title">Lịch Chiếu Phim</h1>

        {/* Date selection */}
        <div className="date-selector">
          {dates.map((date, index) => (
            <div
              key={index}
              className={`date-item ${date.toDateString() === selectedDate.toDateString() ? "active" : ""}`}
              onClick={() => handleDateClick(date)}
            >
              <div className="date-day">{date.getDate()}</div>
              <div className="date-info">
                <div className="date-month">{date.getMonth() + 1}</div>
                <div className="date-weekday">{getDayOfWeek(date)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Movie list with showtimes for selected date */}
        <div className="movies-list">
          {movieShowtimes.length > 0 ? (
            movieShowtimes.map((movie) => (
              <div key={movie._id} className="movie-card">
                <div className="movie-poster">
                  <img src={movie.imageUrl} alt={movie.title} />
                  <div className="movie-age-rating">C16</div>
                </div>
                <div className="movie-details">
                  <h2 className="movie-title">{movie.title}</h2>
                  <div className="movie-info">
                    <div className="movie-info">
                      <span className="movie-genre">◆ {selectedMovie?.genre || "N/A"}</span>
                      <span className="movie-duration">⏱️ {movie.duration || "120"} phút</span>
                    </div>
                  </div>
                  <div className="movie-format">2D PHỤ ĐỀ</div>
                  <div className="showtime-list">
                    {movie.showtime && movie.showtime[0] && movie.showtime[0].times ? (
                      movie.showtime[0].times.map((time, index) => (
                        <div key={index} className="showtime-item" onClick={() => handleBuyTicketClick(movie)}>
                          <div className="showtime-hour">{time.time}</div>
                          <div className="seats-available">{time.seats} ghế trống</div>
                        </div>
                      ))
                    ) : (
                      <div className="no-times">Không có suất chiếu</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-movies">
              <p>Không có lịch chiếu cho ngày {formatDate(selectedDate)}. Vui lòng chọn ngày khác.</p>
            </div>
          )}
        </div>

        {/* Ticket booking modal */}
        {showModal && selectedMovie && (
          <div className="booking-modal-overlay">
            <div className="booking-modal">
              <button className="close-button" onClick={closeModal}>×</button>
              <h2>{selectedMovie.title}</h2>
              <div className="movie-booking-details">
                <div className="movie-poster-small">
                  <img src={selectedMovie.imageUrl} alt={selectedMovie.title} />
                </div>
                <div className="booking-info">
                  <h3>Thông tin đặt vé</h3>
                  <div className="booking-row">
                    <span className="booking-label">Thể loại:</span>
                    <span className="booking-value">{selectedMovie.title}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Rạp:</span>
                    <span className="booking-value">Rạp CINEMA</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Ngày:</span>
                    <span className="booking-value">{formatDate(selectedDate)}</span>
                  </div>
                  <div className="booking-row">
                    <span className="booking-label">Suất chiếu:</span>
                    <select className="time-select">
                      {selectedMovie.showtime && selectedMovie.showtime[0]?.times &&
                        selectedMovie.showtime[0].times.map((timeSlot, idx) => (
                          <option key={idx} value={timeSlot.time} disabled={timeSlot.isBooked}>
                            {timeSlot.time} ({timeSlot.seats} ghế trống)
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  <button className="confirm-booking-button">Continue</button>
                </div>
              </div>
            </div>
          </div>
        )}
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
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
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

export default Showtime;