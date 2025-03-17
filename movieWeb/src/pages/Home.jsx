import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "@splidejs/splide/dist/css/splide.min.css";
import axios from "axios"; // Thêm import axios
import logo from "../assets/logo.jpg";
import poster1 from "../assets/poster/post1.jpg";
import poster2 from "../assets/poster/post2.jpg";
import poster3 from "../assets/poster/post3.jpg";
import poster4 from "../assets/poster/post4.jpg";
import poster5 from "../assets/poster/post5.jpg";
import { getMovies } from "../api";
import "../styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTimes,
  faSearch,
  faSun,
  faMoon,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faYoutube,
  faTiktok,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

// Hook để kiểm tra khi phần tử xuất hiện trong viewport
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

// Component để wrap phần tử cần hiệu ứng animation
const AnimatedSection = ({
  children,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
}) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold,
    rootMargin: "0px 0px -100px 0px",
  });

  return (
    <div
      ref={ref}
      className={`animated-section ${animation} ${isVisible ? "visible" : ""}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: 0,
        transform:
          animation === "fade-up"
            ? "translateY(50px)"
            : animation === "fade-left"
            ? "translateX(-50px)"
            : animation === "fade-right"
            ? "translateX(50px)"
            : "translateY(50px)",
      }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate(); // Thêm useNavigate
  const [currentPoster, setCurrentPoster] = useState(0);
  const posters = [poster1, poster2, poster3, poster4, poster5];
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [user, setUser] = useState(null);

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

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
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

  // Auto-rotate poster carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [posters.length]);

  // Auto-rotate featured movies carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) =>
        prev + 1 >= (movies.length > 5 ? movies.length - 4 : 1) ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Không thể tải danh sách phim.");
      }
    };
    fetchMovies();

    const style = document.createElement("style");
    style.textContent = `
      .animated-section {
        transition: opacity 0.8s ease, transform 0.8s ease;
        will-change: opacity, transform;
      }
      .animated-section.visible {
        opacity: 1 !important;
        transform: translate(0, 0) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handlePrev = () => {
    setCurrentPoster((prev) => (prev === 0 ? posters.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPoster((prev) => (prev === posters.length - 1 ? 0 : prev + 1));
  };

  const handleFeaturedPrev = () => {
    setFeaturedIndex((prev) =>
      prev === 0 ? (movies.length > 5 ? movies.length - 5 : 0) : prev - 1
    );
  };

  const handleFeaturedNext = () => {
    setFeaturedIndex((prev) =>
      prev >= (movies.length > 5 ? movies.length - 5 : 0) ? 0 : prev + 1
    );
  };

  const handleTrailerClick = (url) => {
    setTrailerUrl(url);
  };

  const handleCloseTrailer = () => {
    setTrailerUrl(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleCloseTrailer();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

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

      <div className="poster-container">
        <button onClick={handlePrev} className="arrow-button prev">
          {"<"}
        </button>
        <img src={posters[currentPoster]} alt="Poster" className="poster" />
        <button onClick={handleNext} className="arrow-button next">
          {">"}
        </button>
      </div>

      <AnimatedSection animation="fade-up">
        <div className="featured-movies-section">
          <div className="section-header">
            <h2>Phim Đang Chiếu</h2>
            <div className="view-more">
              <Link to="/movielist">Xem Thêm</Link>
            </div>
          </div>
          <div className="featured-movies-container">
            <button
              onClick={handleFeaturedPrev}
              className="carousel-button prev"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="featured-movies-slider">
              {filteredMovies.length > 0 &&
                filteredMovies
                  .slice(featuredIndex, featuredIndex + 5)
                  .map((movie, index) => (
                    <AnimatedSection
                      key={movie._id}
                      animation="fade-up"
                      delay={index * 100}
                    >
                      <div className="featured-movie-card">
                        <div className="movie-poster">
                          <img src={movie.imageUrl} alt={movie.title} />
                          <div className="movie-overlay">
                            <button
                              className="play-trailer-btn"
                              onClick={() => handleTrailerClick(movie.videoUrl)}
                            >
                              <FontAwesomeIcon icon={faPlay} />
                            </button>
                          </div>
                        </div>
                        <h3 className="movie-title">{movie.title}</h3>
                        <p className="movie-year">
                          ({new Date(movie.releaseDate).getFullYear()})
                        </p>
                      </div>
                    </AnimatedSection>
                  ))}
            </div>
            <button
              onClick={handleFeaturedNext}
              className="carousel-button next"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-left" delay={200}>
        <div className="movie-row-section">
          <div className="section-header">
            <h2>Phim Sắp Ra Mắt</h2>
            <div className="view-more">
              <Link to="/movielist">Xem Thêm</Link>
            </div>
          </div>
          <div className="movie-row-container">
            {filteredMovies.length > 0 ? (
              filteredMovies.slice(0, 8).map((movie, index) => (
                <AnimatedSection
                  key={movie._id}
                  animation="fade-up"
                  delay={index * 100}
                >
                  <div className="movie-row-card">
                    <div className="movie-poster">
                      <img src={movie.imageUrl} alt={movie.title} />
                      <div className="movie-overlay">
                        <button
                          className="play-trailer-btn"
                          onClick={() => handleTrailerClick(movie.videoUrl)}
                        >
                          <FontAwesomeIcon icon={faPlay} />
                        </button>
                      </div>
                    </div>
                    <h3 className="movie-title">{movie.title}</h3>
                  </div>
                </AnimatedSection>
              ))
            ) : (
              <p>Không có phim nào</p>
            )}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-right" delay={300}>
        <div className="card-items">
          <h2>Danh sách phim</h2>
          {error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="movies-grid">
              {filteredMovies.length > 0 ? (
                <>
                  {filteredMovies.map((movie, index) => (
                    <AnimatedSection
                      key={movie._id}
                      animation="fade-up"
                      delay={index * 100}
                    >
                      <div className="movie-item">
                        <div className="movie-image-container">
                          <img src={movie.imageUrl} alt={movie.title} />
                          <button
                            className="trailer-button"
                            onClick={() => handleTrailerClick(movie.videoUrl)}
                          >
                            <FontAwesomeIcon
                              icon={faPlay}
                              style={{ marginRight: "8px" }}
                            />
                            Trailer
                          </button>
                        </div>
                        <h3 className="movie-title">{movie.title}</h3>
                        <p>Thể Loại: {movie.genre}</p>
                        <p>Thời Lượng: {movie.description}</p>
                        <p>
                          Ngày phát hành:{" "}
                          {new Date(movie.releaseDate).toLocaleDateString()}
                        </p>
                        <button
                          className="card-button"
                          onClick={() => handleBuyTicketClick(movie)}
                        >
                          MUA VÉ
                        </button>
                      </div>
                    </AnimatedSection>
                  ))}
                </>
              ) : (
                <p>Không có phim nào</p>
              )}
            </div>
          )}
        </div>
      </AnimatedSection>

      {trailerUrl && (
        <div className="trailer-modal" onClick={handleCloseTrailer}>
          <div className="trailer-content">
            <button className="close-trailer" onClick={handleCloseTrailer}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <video src={trailerUrl} controls autoPlay />
          </div>
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
                    className={`seat ${
                      timeSlot.isBooked ? "booked" : "available"
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

      <footer className="footer">
        <div className="footer-container">
          <AnimatedSection animation="fade-up" delay={100}>
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
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={200}>
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
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={300}>
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
          </AnimatedSection>
        </div>
      </footer>
    </div>
  );
};

export default Home;