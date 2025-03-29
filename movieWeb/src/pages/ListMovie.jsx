import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "@splidejs/splide/dist/css/splide.min.css";
import axios from "axios"; // Thêm import axios
import { getMovies } from "../api";
import "../styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTimes,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ChatButton from "../components/ChatButton";
import Chatbot from "../components/Chatbot";
import moment from "moment";

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
  const navigate = useNavigate(); // Thêm useNavigate
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
  // trừ các số ghế đã đặt
  const [availableSeats, setAvailableSeats] = useState(70);
  const [bookings, setBookings] = useState([]); // Thêm state để lưu trữ dữ liệu bookings

  const [selectedGenre, setSelectedGenre] = useState("Tất cả");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

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
    const showtimeForDate = showtimes.find(
      (showtime) =>
        new Date(showtime.date).toDateString() === new Date(date).toDateString()
    );
    setSelectedShowtime(showtimeForDate);
    setSelectedSeat(null);
  };

  const handleSeatClick = (showtime, timeSlot) => {
    setSelectedSeat(timeSlot);
    setSelectedShowtime({
      ...showtime,
      time: timeSlot.time, // Gán giá trị time từ timeSlot
    });
    setBookingInfo({
      _id: selectedMovie._id,
      movieTitle: selectedMovie.title,
      imageUrl: selectedMovie.imageUrl,
      genre: selectedMovie.genre,
      description: selectedMovie.description,
      cinema: "Rạp CINEMA",
      date: showtime.date,
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
    const date = new Date(dateString); // Chuyển đổi chuỗi ISO thành Date
    return date.toLocaleDateString("vi-VN", options);
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

  // Thêm useEffect để lấy dữ liệu từ bookings
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!selectedMovie || !selectedShowtime) {
        console.warn("Missing required parameters for fetching booked seats.");
        return;
      }

      try {
        const formattedDate = moment(new Date(selectedShowtime.date)).format(
          "YYYY-MM-DD"
        );
        console.log("fetchBookedSeats - movieTitle:", selectedMovie.title);
        console.log("fetchBookedSeats - formattedDate:", formattedDate);

        const response = await axios.get(
          "http://localhost:5000/api/payment/seats/page",
          {
            params: {
              movieTitle: selectedMovie.title,
              date: formattedDate,
            },
          }
        );

        const bookedSeatsByTime = response.data;
        console.log("Booked seats by time:", bookedSeatsByTime);

        // Tính số ghế còn trống cho từng khung giờ
        const totalSeats = 70; // Tổng số ghế
        const availableSeatsByTime = bookedSeatsByTime.map((slot) => ({
          time: slot.time,
          availableSeats: totalSeats - slot.bookedSeats,
        }));

        console.log("Available seats by time:", availableSeatsByTime);

        setBookings(availableSeatsByTime); // Lưu danh sách số ghế còn trống theo từng khung giờ
      } catch (error) {
        console.error("Error fetching booked seats:", error);
      }
    };

    fetchBookedSeats();
  }, [selectedMovie, selectedShowtime]);

  // Thêm hàm để xử lý sự kiện click vào ưu thích phim
  const handleFavoriteClick = (movie) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav._id === movie._id)) {
        // Nếu phim đã có trong danh sách yêu thích, xóa nó
        return prevFavorites.filter((fav) => fav._id !== movie._id);
      } else {
        // Nếu chưa có, thêm vào danh sách yêu thích
        return [...prevFavorites, movie];
      }
    });
  };

  const handleRemoveFavorite = (movieId) => {
    setFavorites((prevFavorites) => prevFavorites.filter((movie) => movie._id !== movieId));
  };

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        favorites={favorites}
        toggleFavorites={() => setShowFavorites(!showFavorites)}
        showFavorites={showFavorites}
      />

      <AnimatedSection animation="fade-right" delay={150}>
        <div className="card-items">
          <h2>Danh sách phim</h2>
          <div className="genre-filter">
            {Array.from(new Set(movies.map((movie) => movie.genre))).map(
              (genre) => (
                <button
                  key={genre}
                  className={`genre-button ${
                    selectedGenre === genre ? "active" : ""
                  }`}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              )
            )}
            <button
              className={`genre-button ${
                selectedGenre === "Tất cả" ? "active" : ""
              }`}
              onClick={() => setSelectedGenre("Tất cả")}
            >
              Tất cả
            </button>
          </div>
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
                            className={`favorite-button ${
                              favorites.some((fav) => fav._id === movie._id)
                                ? "active"
                                : ""
                            }`}
                            onClick={() => handleFavoriteClick(movie)}
                          >
                            <FontAwesomeIcon icon={faHeart} />
                          </button>
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
                        <div className="movie-title">
                          <h3>{movie.title}</h3>
                          <p>Thể Loại: {movie.genre}</p>
                          <p>Thời Lượng: {movie.description}</p>
                          <p>
                            Ngày phát hành:{" "}
                            {new Date(movie.releaseDate).toLocaleDateString()}
                          </p>
                        </div>
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
                {selectedShowtime.times.map((timeSlot) => {
                  // Tìm số ghế còn trống cho khung giờ hiện tại
                  const booking = bookings.find(
                    (b) => b.time === timeSlot.time
                  );
                  const availableSeats = booking ? booking.availableSeats : 70; // Nếu không có dữ liệu, mặc định là 70

                  return (
                    <div
                      key={timeSlot._id}
                      className={`seat ${
                        timeSlot.isBooked ? "booked" : "available"
                      }`}
                      onClick={() =>
                        handleSeatClick(selectedShowtime, timeSlot)
                      }
                    >
                      <p>Giờ: {timeSlot.time}</p>
                      <p>{availableSeats} ghế trống</p>{" "}
                      {/* Hiển thị số ghế còn trống */}
                      <div className="seat-status">
                        {timeSlot.isBooked ? "Đã đặt" : "Ghế trống"}
                      </div>
                    </div>
                  );
                })}
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
                    <td>{formatDate(bookingInfo.date)}</td>
                    <td>{bookingInfo.time}</td>
                  </tr>
                </tbody>
              </table>
              <button className="confirm-button" onClick={handleConfirmBooking}>
                ĐỒNG Ý
              </button>
            </div>
          )}
        </div>
      )}
      {/* // Thêm phần hiển thị danh sách yêu thích */}
      {showFavorites && (
        <div className="favorites-overlay" onClick={() => setShowFavorites(false)}>
          <div className="favorites-list" onClick={(e) => e.stopPropagation()}>
            <button className="close-favorites" onClick={() => setShowFavorites(false)}>
              X
            </button>
            <h2>Danh sách yêu thích</h2>
            {favorites.length > 0 ? (
              <div className="favorites-grid">
                {favorites.map((movie) => (
                  <div key={movie._id} className="favorite-item">
                    <div className="favorite-image-container">
                      <img src={movie.imageUrl} alt={movie.title} className="favorite-image" />
                      <button
                        className="favorite-remove-button"
                        onClick={() => handleRemoveFavorite(movie._id)}
                      >
                        -
                      </button>
                    </div>
                    <div className="favorite-title">
                      <h3
                        className="movie-title-link"
                        onClick={() => navigate(`/movie/${movie._id}`)}
                      >
                        {movie.title}
                      </h3>
                      <p>Thể Loại: {movie.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có phim nào trong danh sách yêu thích.</p>
            )}
          </div>
        </div>
      )}
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <ChatButton />
      <Chatbot />
    </div>
  );
};

export default ListMovie;
