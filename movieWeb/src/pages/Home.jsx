import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "@splidejs/splide/dist/css/splide.min.css";
import axios from "axios";
import logo from "../assets/logo.jpg";
import poster1 from "../assets/poster/post1.jpg";
import poster2 from "../assets/poster/post2.jpg";
import poster3 from "../assets/poster/post3.jpg";
import poster4 from "../assets/poster/post4.jpg";
import poster5 from "../assets/poster/post5.jpg";
import { useLanguage } from "../pages/LanguageContext";
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

import vietnamFlag from "../assets/poster/Vietnam.jpg";
import englandFlag from "../assets/poster/england-flag.png";

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
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation
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
  const [bookingInfo, setBookingInfo] = useState(
    location.state?.bookingInfo || null
  ); // Get bookingInfo from state
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [user, setUser] = useState(null);
  const { language, toggleLanguage } = useLanguage();

  const texts = {
    vi: {
      showtimes: "LỊCH CHIẾU THEO RẠP",
      movies: "PHIM",
      theaters: "RẠP",
      ticketPrices: "GIÁ VÉ",
      news: "TIN MỚI VÀ ƯU ĐÃI",
      searchPlaceholder: "Tìm kiếm phim...",
      logout: "Đăng xuất",
      hello: "Xin chào",
      featuredMovies: "Phim Đang Chiếu",
      upcomingMovies: "Phim Sắp Ra Mắt",
      viewMore: "Xem Thêm",
      noMovies: "Không có phim nào",
      cinemaList: "CÁC RẠP Cinema",
      connectWithUs: "KẾT NỐI VỚI CHÚNG TÔI",
      contact: "LIÊN HỆ",
      companyName: "CÔNG TY CỔ PHẦN CINEMA MEDIA",
      address: "Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
      hotline: "Hotline: 1800 123 456",
      email: "Email: info@cinemamedia.vn",
      copyright: "© 2021 Cinema Media. Tất cả quyền được bảo lưu",
      lightMode: "Chế độ sáng",
      darkMode: "Chế độ tối",
      theatersList: [
        "Cinema Xuân Thủy, Hà Nội - Hotline: 033 023 183",
        "Cinema Tây Sơn, Hà Nội - Hotline: 097 694 713",
        "Cinema Nguyễn Trãi, TP. Hồ Chí Minh - Hotline: 070 675 509",
        "Cinema Quang Trung, TP. Hồ Chí Minh - Hotline: 090 123 456",
        "Cinema Đống Đa, Hà Nội - Hotline: 098 765 432",
        "Cinema Cầu Giấy, Hà Nội - Hotline: 098 765 432",
      ],
      trailer: "Trailer",
      buyTicket: "Mua vé",
      showtimeTitle: "Lịch Chiếu",
      cinema: "Rạp",
      bookingTitle: "Thông Tin Đặt Vé",
      confirm: "Xác nhận",
    },
    en: {
      showtimes: "SHOWTIMES",
      movies: "MOVIES",
      theaters: "THEATERS",
      ticketPrices: "TICKET PRICES",
      news: "NEWS & PROMOTIONS",
      searchPlaceholder: "Search movies...",
      logout: "Logout",
      hello: "Hello",
      featuredMovies: "Featured Movies",
      upcomingMovies: "Upcoming Movies",
      viewMore: "View More",
      noMovies: "No movies available",
      cinemaList: "Cinema THEATERS",
      connectWithUs: "CONNECT WITH US",
      contact: "CONTACT",
      companyName: "CINEMA MEDIA CORPORATION",
      address: "Address: 123 ABC Street, District 1, Ho Chi Minh City",
      hotline: "Hotline: 1800 123 456",
      email: "Email: info@cinemamedia.vn",
      copyright: "© 2021 Cinema Media. All Rights Reserved",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      theatersList: [
        "Cinema Xuan Thuy, Hanoi - Hotline: 033 023 183",
        "Cinema Tay Son, Hanoi - Hotline: 097 694 713",
        "Cinema Nguyen Trai, Ho Chi Minh City - Hotline: 070 675 509",
        "Cinema Quang Trung, Ho Chi Minh City - Hotline: 090 123 456",
        "Cinema Dong Da, Hanoi - Hotline: 098 765 432",
        "Cinema Cau Giay, Hanoi - Hotline: 098 765 432",
      ],
      trailer: "Trailer",
      buyTicket: "Buy Ticket",
      showtimeTitle: "Showtimes",
      cinema: "Cinema",
      bookingTitle: "Booking Information",
      confirm: "Confirm",
    },
  };

  const handleBuyTicketClick = async (movie) => {
    setSelectedMovie(movie);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/showtimes?movieId=${movie._id}`
      );
      setShowtimes(response.data);
      if (response.data.length > 0) {
        setSelectedShowtime(response.data[0]);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [posters.length]);

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
            <li>
              <Link to="/showtimes">{texts[language].showtimes}</Link>
            </li>
            <li>
              <Link to="/movielist">{texts[language].movies}</Link>
            </li>
            <li>
              <Link to="/place">{texts[language].theaters}</Link>
            </li>
            <li>
              <Link to="/about">{texts[language].ticketPrices}</Link>
            </li>
            <li>
              <Link to="/news">{texts[language].news}</Link>
            </li>
            {user ? (
              <>
                <li>
                  <span>
                    {texts[language].hello}, {user.name}
                  </span>
                </li>
                <li>
                  <button onClick={handleLogout}>{texts[language].logout}</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="search-bar">
          <input
            type="text"
            placeholder={texts[language].searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <button className="language-toggle" onClick={toggleLanguage}>
          <img
            src={language === "vi" ? englandFlag : vietnamFlag}
            alt="Language"
            className="flag-icon"
          />
        </button>
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
            <h2>{texts[language].featuredMovies}</h2>
            <div className="view-more">
              <Link to="/movielist">{texts[language].viewMore}</Link>
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
            <h2>{texts[language].upcomingMovies}</h2>
            <div className="view-more">
              <Link to="/movielist">{texts[language].viewMore}</Link>
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
              <p>{texts[language].noMovies}</p>
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
            <div className="movies-list">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie, index) => (
                  <AnimatedSection
                    key={movie._id}
                    animation="fade-up"
                    delay={index * 150}
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
                          {texts[language].trailer}
                        </button>
                      </div>
                      <h3>{movie.title}</h3>
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
                        {texts[language].buyTicket}
                      </button>
                    </div>
                  </AnimatedSection>
                ))
              ) : (
                <p>{texts[language].noMovies}</p>
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
            <h2>{texts[language].showtimeTitle} - {selectedMovie.title}</h2>
            <h1>{texts[language].cinema}</h1>
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
              <h3>{texts[language].bookingTitle}</h3>
              <h2>{bookingInfo.movieTitle}</h2>
              <table>
                <tbody>
                  <tr>
                    <th>{texts[language].cinema}</th>
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
                {texts[language].confirm}
              </button>
            </div>
          )}
        </div>
      )}

      <footer className="footer">
        <div className="footer-container">
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="footer-section left">
              <h3>{texts[language].cinemaList}</h3>
              <ul>
                {texts[language].theatersList.map((theater, index) => (
                  <li key={index}>{theater}</li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="footer-section center">
              <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
              </Link>
              <p>{texts[language].copyright}</p>
              <button className="toggle-button" onClick={toggleDarkMode}>
                {darkMode ? (
                  <FontAwesomeIcon icon={faSun} />
                ) : (
                  <FontAwesomeIcon icon={faMoon} />
                )}
                {darkMode ? `${texts[language].lightMode}` : `${texts[language].darkMode}`}
              </button>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={300}>
            <div className="footer-section right">
              <h3>{texts[language].connectWithUs}</h3>
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
              <h3>{texts[language].contact}</h3>
              <p>{texts[language].companyName}</p>
              <p>{texts[language].address}</p>
              <p>{texts[language].hotline}</p>
              <p>{texts[language].email}</p>
            </div>
          </AnimatedSection>
        </div>
      </footer>
    </div>
  );
};

export default Home;