import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import axios from "axios";
import "../styles/Showtime.css";
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

const Showtime = () => {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movieShowtimes, setMovieShowtimes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xem lịch chiếu và giờ chiếu
  const handleBuyTicketClick = async (movie) => {
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

  // Fetch movies and showtimes from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movies
        const moviesResponse = await axios.get("http://localhost:5000/api/movies");
        setMovies(moviesResponse.data);

        // Fetch showtimes
        const showtimesResponse = await axios.get("http://localhost:5000/api/showtimes");
        setShowtimes(showtimesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Process data when selectedDate changes
  useEffect(() => {
    const processShowtimesData = () => {
      const formattedSelectedDate = selectedDate.toISOString().split("T")[0];

      // Lọc showtimes theo ngày đã chọn
      const filteredShowtimes = showtimes.filter((showtime) => {
        const showtimeDate = new Date(showtime.date).toISOString().split("T")[0];
        return showtimeDate === formattedSelectedDate;
      });

      // Ánh xạ dữ liệu phim với showtimes
      const moviesWithShowtimes = filteredShowtimes.map((showtime) => {
        const movie = showtime.movieId; // Lấy thông tin phim từ movieId
        return {
          ...movie,
          showtime: showtime.times, // Gắn danh sách thời gian chiếu
        };
      });

      setMovieShowtimes(moviesWithShowtimes);
    };

    if (showtimes.length > 0) {
      processShowtimesData();
    }
  }, [showtimes, selectedDate]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const generateDates = () => {
    const dates = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Lấy số ngày trong tháng hiện tại
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const dates = generateDates();

  return (
    <div className="new-showtime-container">
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
      <h1 className="page-title">Lịch Chiếu Phim</h1>
      {/* Date selection */}
      <div className="date-selector">
        <div className="month-navigation">
          <button onClick={handlePreviousMonth}>Tháng trước</button>
          <span>
            {currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
          </span>
          <button onClick={handleNextMonth}>Tháng sau</button>
        </div>
        <div className="dates-grid">
          {dates.slice(0, 7).map((date, index) => (
            <div
              key={index}
              className={`date-item ${date.toDateString() === selectedDate.toDateString() ? "active" : ""}`}
              onClick={() => handleDateClick(date)}
            >
              <div className="date-day">{date.getDate()}</div>
              <div className="date-info">
                <div className="date-weekday">{date.toLocaleDateString("vi-VN", { weekday: "short" })}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="view-full-calendar" onClick={() => setShowFullCalendar(true)}>
          Xem lịch đầy đủ
        </button>

        {/* Full calendar modal */}
        {showFullCalendar && (
          <div className="full-calendar-modal">
            <div className="full-calendar-content">
              <button className="close-calendar" onClick={() => setShowFullCalendar(false)}>
                Đóng
              </button>
              <div className="dates-grid-full">
                {dates.map((date, index) => (
                  <div
                    key={index}
                    className={`date-item ${date.toDateString() === selectedDate.toDateString() ? "active" : ""}`}
                    onClick={() => {
                      handleDateClick(date);
                      setShowFullCalendar(false); // Đóng modal sau khi chọn ngày
                    }}
                  >
                    <div className="date-day">{date.getDate()}</div>
                    <div className="date-info">
                      <div className="date-weekday">{date.toLocaleDateString("vi-VN", { weekday: "short" })}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Movie list with showtimes */}
      <div className="movies-list">
        {movieShowtimes.length > 0 ? (
          movieShowtimes.map((movie) => (
            <div key={movie._id} className="movie-card">
              <div className="movie-poster">
                <img src={movie.imageUrl} alt={movie.title} />
              </div>
              <div className="movie-details">
                <h2 className="movie-title">{movie.title}</h2>
                <p className="movie-description">{movie.description}</p>
                <p className="movie-genre">Thể loại: {movie.genre}</p>
                <p className="movie-release-date">Ngày phát hành: {formatDate(movie.releaseDate)}</p>
                <div className="showtime-list">
                  {movie.showtime.map((time, index) => (
                    <div key={index} className="showtime-item" onClick={() => handleBuyTicketClick(movie)}>
                      <span className="showtime-hour">{time.time}</span>
                      <span className="seats-available">{time.seats} ghế trống</span>
                    </div>
                  ))}
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
  );
};

export default Showtime;