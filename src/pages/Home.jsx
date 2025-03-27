import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import poster1 from "../assets/poster/post1.jpg";
import poster2 from "../assets/poster/post2.jpg";
import poster3 from "../assets/poster/post3.jpg";
import poster4 from "../assets/poster/post4.jpg";
import poster5 from "../assets/poster/post5.jpg";
import { getMovies } from "../api";
import "../styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

const Home = () => {
  const [currentPoster, setCurrentPoster] = useState(0);
  const posters = [poster1, poster2, poster3, poster4, poster5];
  const navigate = useNavigate();

  const handlePrev = () => {
    setCurrentPoster((prev) => (prev === 0 ? posters.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPoster((prev) => (prev === posters.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);

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
  }, []);

  const handleTrailerClick = (url) => {
    setTrailerUrl(url);
  };

  const handleCloseTrailer = () => {
    setTrailerUrl(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseTrailer();
      }
    };

    const handleClickOutside = (e) => {
      if (e.target.className === "trailer-modal") {
        handleCloseTrailer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // xem lịch chiếu và giờ chiếu
  const handleBuyTicketClick = async (movie) => {
    setSelectedMovie(movie);
    try {
      const response = await axios.get(`http://localhost:5000/api/showtimes?movieId=${movie._id}`);
      setShowtimes(response.data);
      if (response.data.length > 0) {
        setSelectedShowtime(response.data[0]); // Tự động chọn ngày đầu tiên
      }
    } catch (error) {
      console.error('Lỗi khi lấy lịch chiếu:', error);
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
    const showtimeForDate = showtimes.find(showtime => showtime.date === date);
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
      date: formatDate(selectedShowtime.date),
      time: timeSlot.time,
      seat: timeSlot.seats,
      status: timeSlot.isBooked ? 'Đã đặt' : 'Ghế trống'
    });
  };

  const handleConfirmBooking = () => {
    const isLoggedIn = localStorage.getItem("userInfo"); // Check if user is logged in
    if (!isLoggedIn) {
      navigate('/login', { state: { bookingInfo } });
    } else {
      navigate('/movie-detail', { state: { bookingInfo } });
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };
    
  const [user, setUser] = useState(null); // Thêm trạng thái để lưu thông tin người dùng
  useEffect(() => {
      // Lấy thông tin người dùng từ localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (userInfo) {
        setUser(userInfo);
      }
    }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate('/');
  };
  return (
    <div className="home-container">
      <header>
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <nav>
          <ul>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/tvshows">TV Shows</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            {user ? (
              <>
                <li>
                  <span>Xin chào, {user.name}</span>
                </li>
                <li>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>        
              )}
          </ul>
        </nav>
      </header>

      <div className="poster-container">
        <button onClick={handlePrev} className="arrow-button prev">{"<"}</button>
        <img src={posters[currentPoster]} alt="Poster" className="poster" />
        <button onClick={handleNext} className="arrow-button next">{">"}</button>
      </div>

      <div className="card-items">
        <h2>Danh sách phim</h2>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="movies-list">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div key={movie._id} className="movie-item">
                  <div className="movie-image-container">
                    <img src={movie.imageUrl} alt={movie.title} />
                    <button className="trailer-button" onClick={() => handleTrailerClick(movie.videoUrl)}>
                      <FontAwesomeIcon icon={faPlay} style={{ marginRight: "8px" }} />
                      Trailer
                    </button>           
                  </div>
                  <h3>{movie.title}</h3>
                  <p>Thể Loại: {movie.genre}</p>
                  <p>Thời Lượng: {movie.description}</p>
                  <p>Ngày phát hành: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                  <button className="card-button" onClick={() => handleBuyTicketClick(movie)}>MUA VÉ</button>
                </div>
              ))
            ) : (
              <p>Đang tải...</p>
            )}
          </div>
        )}
      </div>

      {trailerUrl && (
        <div className="trailer-modal">
          <div className="trailer-content">
            <video src={trailerUrl} controls autoPlay />
          </div>
        </div>
      )}

      {showPopup && selectedMovie && (
        <div className="showtimes-pop-up">
          <div className="showtimes-content">
            <button className="close-button" onClick={handleClosePopup}>X</button>
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
                  className={selectedShowtime && selectedShowtime.date === date ? 'selected' : ''}
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
                    className={`seat ${timeSlot.isBooked ? 'booked' : 'available'}`}
                    onClick={() => handleSeatClick(selectedShowtime, timeSlot)}
                  >
                    <p>Giờ: {timeSlot.time}</p>
                    <p>{timeSlot.seats} ghế trống</p>
                    <div className="seat-status">{timeSlot.isBooked ? 'Đã đặt' : 'Ghế trống'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {bookingInfo && (
            <div className="booking-info">
              <button className="close-button" onClick={handleClosePopup}>X</button>
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
              <button className="confirm-button" onClick={handleConfirmBooking}>ĐỒNG Ý</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;