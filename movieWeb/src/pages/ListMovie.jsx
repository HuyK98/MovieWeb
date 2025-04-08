import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "@splidejs/splide/dist/css/splide.min.css";
import axios from "axios";
import logo from "../assets/logo.jpg";
import { getMovies } from "../api";
import "../styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLanguage } from "../pages/LanguageContext";
import vietnamFlag from "../assets/poster/Vietnam.jpg";
import englandFlag from "../assets/poster/england-flag.png";
import translations from "../pages/translations";
import {
  faPlay,
  faTimes,
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

const ListMovie = () => {
  const navigate = useNavigate();
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
  const { language, toggleLanguage } = useLanguage();

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
      console.error("Error fetching showtimes:", error);
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
    const showtimeForDate = showtimes.find(
      (showtime) => showtime.date === date
    );
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
      cinema: translations[language].cinema,
      date: formatDate(showtime.date),
      time: timeSlot.time,
      seat: timeSlot.seats,
      status: timeSlot.isBooked ? translations[language].booked : translations[language].available,
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
    return new Date(dateString).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", options);
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
        setError(translations[language].errorLoading);
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
  }, [language]); // Thêm language vào dependency để cập nhật lỗi theo ngôn ngữ

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
            <li><Link to="/showtimes">{translations[language].showtimes}</Link></li>
            <li><Link to="/movielist">{translations[language].movies}</Link></li>
            <li><Link to="/place">{translations[language].theaters}</Link></li>
            <li><Link to="/about">{translations[language].ticketPrices}</Link></li>
            <li><Link to="/news">{translations[language].news}</Link></li>
            {user ? (
              <>
                <li><span>{translations[language].hello}, {user.name}</span></li>
                <li><button onClick={handleLogout}>{translations[language].logout}</button></li>
              </>
            ) : (
              <li><Link to="/login">{translations[language].login}</Link></li>
            )}
          </ul>
        </nav>
        <div className="search-bar">
          <input
            type="text"
            placeholder={translations[language].searchPlaceholder}
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
  
      <AnimatedSection animation="fade-right" delay={150}>
        <div className="card-items">
          <h2>{translations[language].movieList}</h2>
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
                            {translations[language].trailer}
                          </button>
                        </div>
                        <div className="movie-title">
                          <h3>{movie.title}</h3>
                          <p>{translations[language].genre}: {movie.genre}</p>
                          <p>{translations[language].duration}: {movie.description}</p>
                          <p>
                            {translations[language].releaseDate}:{" "}
                            {new Date(movie.releaseDate).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          className="card-button"
                          onClick={() => handleBuyTicketClick(movie)}
                        >
                          {translations[language].buyTicket}
                        </button>
                      </div>
                    </AnimatedSection>
                  ))}
                </>
              ) : (
                <p>{translations[language].noMovies}</p>
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
            <h2>{translations[language].showtimeTitle} - {selectedMovie.title}</h2>
            <h1>{translations[language].cinema}</h1>
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
                    <p>{translations[language].timeLabel}: {timeSlot.time}</p>
                    <p>{timeSlot.seats} {translations[language].seatsAvailable}</p>
                    <div className="seat-status">
                      {timeSlot.isBooked ? translations[language].booked : translations[language].available}
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
              <h3>{translations[language].bookingTitle}</h3>
              <h2>{bookingInfo.movieTitle}</h2>
              <table>
                <tbody>
                  <tr>
                    <th>{translations[language].cinemaHeader}</th>
                    <th>{translations[language].dateHeader}</th>
                    <th>{translations[language].timeHeader}</th>
                  </tr>
                  <tr>
                    <td>{bookingInfo.cinema}</td>
                    <td>{bookingInfo.date}</td>
                    <td>{bookingInfo.time}</td>
                  </tr>
                </tbody>
              </table>
              <button className="confirm-button" onClick={handleConfirmBooking}>
                {translations[language].confirm}
              </button>
            </div>
          )}
        </div>
      )}
  
      <footer className="footer">
        <div className="footer-container">
          <AnimatedSection animation="fade-up" delay={100}>
            <div className="footer-section left">
              <h3>{translations[language].cinemaList}</h3>
              <ul>
                {translations[language].theatersList.map((theater, index) => (
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
              <p>{translations[language].copyright}</p>
              <button className="toggle-button" onClick={toggleDarkMode}>
                {darkMode ? (
                  <FontAwesomeIcon icon={faSun} />
                ) : (
                  <FontAwesomeIcon icon={faMoon} />
                )}
                {darkMode ? ` ${translations[language].lightMode}` : ` ${translations[language].darkMode}`}
              </button>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={150}>
            <div className="footer-section right">
              <h3>{translations[language].connectWithUs}</h3>
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
              <h3>{translations[language].contact}</h3>
              <p>{translations[language].companyName}</p>
              <p>{translations[language].address}</p>
              <p>{translations[language].hotline}</p>
              <p>{translations[language].email}</p>
            </div>
          </AnimatedSection>
        </div>
      </footer>
    </div>
  );
  
};

export default ListMovie;