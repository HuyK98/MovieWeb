import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.jpg";
import "../styles/Showtime.css";
import {
  faFacebookF,
  faYoutube,
  faTiktok,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Showtimes = () => {
  const [showtimeData, setShowtimeData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMovie, setSelectedMovie] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [moviesWithShowtimes, setMoviesWithShowtimes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);

  const navigate = useNavigate();

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

  useEffect(() => {

    // Xem lịch chiếu và giờ chiếu

    // Fetch showtimes data
    const fetchShowtimes = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const response = await axios.get(`http://localhost:5000/api/showtimes?date=${formattedDate}`);
        setShowtimeData(response.data);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, [selectedDate]);

  // Process showtime data whenever it changes
  useEffect(() => {
    if (showtimeData.length > 0) {
      // Create a map to group showtimes by movieId
      const movieMap = new Map();

      showtimeData.forEach(item => {
        // Check if the showtime date matches the selected date
        const showtimeDate = new Date(item.date).toISOString().split('T')[0];
        const selectedDateStr = selectedDate.toISOString().split('T')[0];

        if (showtimeDate === selectedDateStr) {
          const movieId = item.movieId._id;

          if (!movieMap.has(movieId)) {
            movieMap.set(movieId, {
              id: movieId,
              _id: movieId, // Ensure _id is set
              title: item.movie.title,
              genre: item.movie.genre,
              duration: 120, // Assuming a default duration if not provided
              image: item.movie.imageUrl,
              showtimes: [],
              seats: []
            });
          }

          // Add times and seats to the movie
          const movie = movieMap.get(movieId);
          item.times.forEach(timeObj => {
            movie.showtimes.push(timeObj.time);
            movie.seats.push(timeObj.seats);
          });
        }
      });

      // Convert map to array
      const moviesArray = Array.from(movieMap.values());
      setMoviesWithShowtimes(moviesArray);
    } else {
      setMoviesWithShowtimes([]);
    }
  }, [showtimeData, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    setUser(null);
    // Additional logout logic here
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit" };
    return new Date(date).toLocaleDateString("vi-VN", options);
  };

  const getDayOfWeek = (date) => {
    const options = { weekday: "long" };
    return new Date(date).toLocaleDateString("vi-VN", options);
  };

  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      dates.push({
        date: date,
        day: date.getDate(),
        month: date.getMonth() + 1,
        dayOfWeek: getDayOfWeek(date).substring(0, 2).toUpperCase(),
      });
    }

    return dates;
  };

  const dates = generateDates();

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const handleConfirmBooking = () => {
    const isLoggedIn = localStorage.getItem("userInfo");
    if (!isLoggedIn) {
      navigate("/login", { state: { bookingInfo } });
    } else {
      navigate("/movie-detail", { state: { bookingInfo } });
    }
  };

  return (
    <div className={`beta-cinema-container ${darkMode ? "dark-mode" : ""}`}>
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

      <main className="beta-main">
        <div className="date-selector">
          {dates.map((date, index) => (
            <div
              key={index}
              className={`date-item ${date.date.toDateString() === selectedDate.toDateString() ? 'active' : ''}`}
              onClick={() => handleDateChange(date.date)}
            >
              <div className="date-number">{date.day}</div>
              <div className="date-info">/0{date.month} - {date.dayOfWeek}</div>
            </div>
          ))}
        </div>

        <div className="movie-listings">
          {moviesWithShowtimes.length > 0 ? (
            moviesWithShowtimes.map((movie) => (
              <div key={movie.id} className="movie-card">
                <div className="movie-poster">
                  <img src={movie.image} alt={movie.title} />
                  <div className="age-rating">T16</div>
                </div>

                <div className="movie-details">
                  <h2 className="movie-title">{movie.title}</h2>
                  <div className="movie-meta">
                    <span className="movie-genre">◆{movie.genre}</span>
                    <span className="movie-duration">⏱️ {movie.duration} phút</span>
                  </div>

                  <div className="movie-type">2D PHỤ ĐỀ</div>

                  <div className="showtime-list">
                    {movie.showtimes.map((time, index) => (
                      <div key={index} className="showtime-item" onClick={() => handleBuyTicketClick(movie)}>
                        <div className="showtime-hour">{time}</div>
                        <div className="seats-available">{movie.seats[index]} ghế trống</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-showtimes">
              <p>Không có lịch chiếu cho ngày này. Vui lòng chọn ngày khác.</p>
            </div>
          )}

          {showPopup && selectedMovie && (
            <div className="showtimes-pop-up">
              <div className="showtimes-content">
                <button className="close-button" onClick={handleClosePopup}>
                  X
                </button>
                <h2>LỊCH CHIẾU - {selectedMovie.title}</h2>
                <h1>Rạp CINEMA</h1>
                <ul className="date-showtime">
                  {showtimes
                    .map((showtime) => showtime.date)
                    .filter((date, index, self) => self.indexOf(date) === index)
                    .map((date) => (
                      <li
                        key={date}
                        onClick={() => handleDateClick(date)}
                        className={
                          selectedShowtime && selectedShowtime.date === date
                            ? "selected"
                            : ""
                        }
                      >
                        {formatDate(date)}
                      </li>
                    ))}
                </ul>
                {selectedShowtime && (
                  <div className="seats">
                    {selectedShowtime.times.map((timeSlot) => (
                      <div
                        key={timeSlot._id}
                        className={`seat ${timeSlot.isBooked ? "booked" : "available"
                          }`}
                        onClick={() => handleSeatClick(selectedShowtime, timeSlot)}
                      >
                        <p>Giờ: {timeSlot.time}</p>
                        <p>{timeSlot.seats} ghế trống</p>
                        <div className="seat-status">
                          {timeSlot.isBooked ? "Đã đặt" : "Ghế trống"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {bookingInfo && (
                <div className="booking-info">
                  <button className="close-button" onClick={handleClosePopup}>
                    X
                  </button>
                  <h3>BẠN ĐANG ĐẶT VÉ XEM PHIM</h3>
                  <h2>{bookingInfo.movieTitle}</h2>
                  <table>
                    <tbody>
                      <tr>
                        <th>RẠP CHIẾU</th>
                        <th>NGÀY CHIẾU</th>
                        <th>GIỜ CHIẾU</th>
                      </tr>
                      <tr>
                        <td>{bookingInfo.cinema}</td>
                        <td>{bookingInfo.date}</td>
                        <td>{bookingInfo.time}</td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    className="confirm-button"
                    onClick={handleConfirmBooking}
                  >
                    ĐỒNG Ý
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

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

export default Showtimes;