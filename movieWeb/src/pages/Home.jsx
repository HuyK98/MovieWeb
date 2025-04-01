import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "@splidejs/splide/dist/css/splide.min.css";
import axios from "axios"; // Thêm import axios
import poster1 from "../assets/poster/post1.jpg";
import poster2 from "../assets/poster/post2.jpg";
import poster3 from "../assets/poster/post3.jpg";
import poster4 from "../assets/poster/post4.jpg";
import poster5 from "../assets/poster/post5.jpg";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { getMovies } from "../api";
import "../styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faHeart,
  faChevronLeft,
  faChevronRight,
  faShoppingCart
} from "@fortawesome/free-solid-svg-icons";
import ChatButton from "../components/ChatButton";
import Chatbot from "../components/Chatbot";
import TrailerModal from "../components/TrailerModal";
import moment from 'moment';
import PosterSection from "../components/PosterSection";
import "../styles/ManageGenres.css";

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
  const [availableSeats, setAvailableSeats] = useState(70);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [activeSeat, setActiveSeat] = useState(null);

  // Thêm các state để quản lý phim đang chiếu và phim sắp chiếu
  const [currentTab, setCurrentTab] = useState("now-showing");
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  const [bookings, setBookings] = useState([]);

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

      // Chuyển đổi date từ chuỗi ISO thành kiểu Date
      const showtimesWithDate = response.data.map((showtime) => ({
        ...showtime,
        date: new Date(showtime.date),
      }));

      setShowtimes(showtimesWithDate);
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
  const handleCloseBookingInfo = () => {
    setBookingInfo(null);
  };

  const handleDateClick = (date) => {

    const showtimeForDate = showtimes.find(
      (showtime) => new Date(showtime.date).toDateString() === new Date(date).toDateString()
    );
    setSelectedShowtime(showtimeForDate);
    setSelectedSeat(null);
  };

  const handleSeatClick = (showtime, timeSlot) => {
    console.log("Debugging handleSeatClick - showtime.date:", showtime.date); // Log giá trị ngày
    setActiveSeat(timeSlot.time);
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

  // Xử lý sự kiện khi người dùng nhấp vào nút "Đồng ý" trong bookingInfo
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
    const date = new Date(dateString);
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

  // Auto-rotate poster carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [posters.length]);


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
      prev === 0 ? nowShowingMovies.length - 6 : prev - 1
    );
  };

  const handleFeaturedNext = () => {
    setFeaturedIndex((prev) =>
      (prev + 1) % nowShowingMovies.length
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

  // Thêm hàm để xử lý sự kiện nhấp chuột vào các tab
  const handleTabClick = (tab) => {
    setCurrentTab(tab);
  };

  const handleFavoriteClick = (movie) => {
    if (!user) {
      alert("Bạn cần đăng nhập để thêm vào danh sách yêu thích.");
      return;
    }

    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.some((fav) => fav._id === movie._id)
        ? prevFavorites.filter((fav) => fav._id !== movie._id)
        : [...prevFavorites, movie];

      // Lưu danh sách yêu thích vào localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const handleRemoveFavorite = (movieId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((movie) => movie._id !== movieId);

      // Cập nhật lại localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      return updatedFavorites;
    });
  };

  const handleCloseShowtimesPopup = (e) => {
    // Nếu có sự kiện và nhấp vào bên trong nội dung popup, không đóng
    if (e && e.target.closest(".showtimes-content")) {
      return;
    }
    setShowPopup(false);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeat(null);
    setBookingInfo(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseShowtimesPopup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Cập nhật useEffect để lấy danh sách phim đang chiếu và phim sắp chiếu
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/movies");
        const data = response.data;

        if (Array.isArray(data)) {
          const nowShowing = data.filter(
            (movie) => new Date(movie.releaseDate) <= new Date()
          );
          setNowShowingMovies(nowShowing);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Không thể tải danh sách phim.");
      }
    };

    fetchMovies();
  }, []);

  const visibleMovies = [
    ...nowShowingMovies.slice(featuredIndex, featuredIndex + 6),
    ...nowShowingMovies.slice(0, Math.max(0, featuredIndex + 6 - nowShowingMovies.length)),
  ];

  // Thêm useEffect để lấy dữ liệu từ bookings
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!selectedMovie || !selectedShowtime) {
        // console.warn('Missing required parameters for fetching booked seats.');
        return;
      }

      try {
        const formattedDate = moment(new Date(selectedShowtime.date)).format('YYYY-MM-DD');
        console.log('fetchBookedSeats - movieTitle:', selectedMovie.title);
        console.log('fetchBookedSeats - formattedDate:', formattedDate);

        const response = await axios.get('http://localhost:5000/api/payment/seats/page', {
          params: {
            movieTitle: selectedMovie.title,
            date: formattedDate,
          },
        });

        const bookedSeatsByTime = response.data;
        console.log('Booked seats by time:', bookedSeatsByTime);

        // Tính số ghế còn trống cho từng khung giờ
        const totalSeats = 70; // Tổng số ghế
        const availableSeatsByTime = bookedSeatsByTime.map((slot) => ({
          time: slot.time,
          availableSeats: totalSeats - slot.bookedSeats,
        }));

        console.log('Available seats by time:', availableSeatsByTime);

        setBookings(availableSeatsByTime); // Lưu danh sách số ghế còn trống theo từng khung giờ
      } catch (error) {
        console.error('Error fetching booked seats:', error);
      }
    };

    fetchBookedSeats();
  }, [selectedMovie, selectedShowtime]);

  // Thêm useEffect để cuộn trang khi người dùng cuộn
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

  //lấy danh sách yêu thích từ localStorage khi reload
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }
  }, []);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    setBookings(storedBookings);
  }, []);

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
        isScrolled={isScrolled}
      />

      <div className="home-content">
        <div className="poster-container">
          <button onClick={handlePrev} className="arrow-button prev">
            {"<"}
          </button>
          <img src={posters[currentPoster]} alt="Poster" className="poster" />
          <button onClick={handleNext} className="arrow-button next">
            {">"}
          </button>
        </div>

        {/* Thêm thanh điều hướng */}
        <div className="movie-tabs">
          <button
            className={currentTab === "now-showing" ? "active" : ""}
            onClick={() => handleTabClick("now-showing")}
          >
            Phim Đang Chiếu
          </button>
          <button
            className={currentTab === "upcoming" ? "active" : ""}
            onClick={() => handleTabClick("upcoming")}
          >
            Phim Sắp Ra Mắt
          </button>
        </div>

        {currentTab === "now-showing" && (
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
                  {visibleMovies.map((movie, index) => (
                    <AnimatedSection key={movie._id} animation="fade-up">
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
                        <h3 className="movie-title1">{movie.title}</h3>
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
            {/* Poster Section */}
            <div className="poster-header">
              <h2>XEM GÌ TẠI CINEMA</h2>
            </div>
            <PosterSection movies={movies} />
          </AnimatedSection>
        )}

        {currentTab === "upcoming" && (
          <AnimatedSection animation="fade-left">
            <div className="movie-row-section">
              <div className="section-header">
                <button
                  onClick={handleFeaturedPrev}
                  className="carousel-button prev"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <h2>Phim Sắp Ra Mắt</h2>
                <div className="view-more">
                  <Link to="/movielist">Xem Thêm</Link>
                </div>
              </div>
              <div className="movie-row-container">

                {upcomingMovies.length > 0 ? (
                  upcomingMovies.slice(0, 8).map((movie, index) => (
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
                        <h3 className="movie-title1">{movie.title}</h3>
                        <p className="movie-year">
                          ({new Date(movie.releaseDate).getFullYear()})
                        </p>
                      </div>

                    </AnimatedSection>
                  ))
                ) : (
                  <p>Không có phim nào</p>
                )}
              </div>
              <button
                onClick={handleFeaturedNext}
                className="carousel-button next"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection animation="fade-right" delay={10}>
          <div className="card-items">
            <h2>Danh sách phim</h2>
            <div className="genre-filter">
              {Array.from(new Set(movies.map((movie) => movie.genre))).map((genre) => (
                <button
                  key={genre}
                  className={`genre-button ${selectedGenre === genre ? "active" : ""}`}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              ))}
              <button
                className={`genre-button ${selectedGenre === "Tất cả" ? "active" : ""}`}
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
                    {filteredMovies
                      .filter((movie) =>
                        selectedGenre === "Tất cả" || movie.genre === selectedGenre
                      )
                      .map((movie, index) => (
                        <AnimatedSection
                          key={movie._id}
                          animation="fade-up"
                          delay={index * 100}
                        >
                          <div className="movie-item">
                            <div className="movie-image-container">
                              <img src={movie.imageUrl} alt={movie.title} />
                              <button
                                className={`favorite-button ${favorites.some((fav) => fav._id === movie._id) ? "active" : ""}`}
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
                              <h3
                                className="movie-title-link"
                                onClick={() => navigate(`/movie/${movie._id}`)}
                              >
                                {movie.title}
                              </h3>
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
      </div>
      <TrailerModal trailerUrl={trailerUrl} onClose={handleCloseTrailer} />;
      {showPopup && selectedMovie && (
        <div className="showtimes-pop-up" onClick={handleCloseShowtimesPopup}>
          <div className="showtimes-content" onClick={(e) => e.stopPropagation()}>
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
                  const booking = bookings.find((b) => b.time === timeSlot.time);
                  const availableSeats = booking ? booking.availableSeats : 70; // Nếu không có dữ liệu, mặc định là 70

                  return (
                    <div
                      key={timeSlot._id}
                      className={`seat ${timeSlot.isBooked ? "booked" : "available"} ${activeSeat === timeSlot.time ? "active" : ""
                        }`}
                      onClick={() => handleSeatClick(selectedShowtime, timeSlot)}
                    >
                      <p>Giờ: {timeSlot.time}</p>
                      <p>{availableSeats} ghế trống</p>
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
              <button className="close-button" onClick={handleCloseBookingInfo}>
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
            <h2>THÔNG BÁO</h2>
            {favorites.length > 0 ? (
              <div className="favorites-grid">
                {favorites.map((movie) => (
                  <div key={movie._id} className="favorite-item">
                    <div className="favorite-image-container">
                      <img src={movie.imageUrl} alt={movie.title} className="favorite-image" />
                      {/* Hiển thị biểu tượng trái tim nếu là yêu thích */}
                      <div className="favorite-icon">
                        <FontAwesomeIcon icon={faHeart} />
                      </div>
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

            {/* Hiển thị danh sách đơn hàng */}
            {bookings.length > 0 &&
              bookings.map((booking, index) => (
                <div key={index} className="favorite-item">
                  <div className="favorite-image-container">
                    <img src={booking.movie.imageUrl} alt={booking.movie.title} className="favorite-image" />
                    {/* Hiển thị biểu tượng hóa đơn nếu là đơn hàng */}
                    <div className="bill-icon">
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                  </div>
                  <div className="favorite-title">
                    <h3
                      className="movie-title-link"
                      onClick={() => navigate(`/booking/${index}`)}
                    >
                      {booking.movie.title}
                    </h3>
                    <p>Ngày chiếu: {moment(booking.booking.date).format('DD/MM/YYYY')}</p>
                    <p>Ghế: {booking.booking.seats.join(', ')}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )};

      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <ChatButton />
      <Chatbot />
    </div>
  );
};

export default Home;