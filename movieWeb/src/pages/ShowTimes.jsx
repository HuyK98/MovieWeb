import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import "../styles/ShowTimes.css"; // Import CSS file

const Showtimes = () => {
  const [movies, setMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleMovieChange = (e) => {
    setSelectedMovie(e.target.value);
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit" };
    return new Date(date).toLocaleDateString("vi-VN", options);
  };

  const getDayOfWeek = (date) => {
    const options = { weekday: "long" };
    return new Date(date).toLocaleDateString("vi-VN", options);
  };

  const today = new Date();
  const formattedDate = formatDate(today);
  const dayOfWeek = getDayOfWeek(today);

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
              <Link to="/showtimes">LỊCH CHIẾU THEO RẠP</Link>
            </li>
            <li>
              <Link to="/movielist">PHIM</Link>
            </li>
            <li>
              <Link to="/place">RẠP</Link>
            </li>
            <li>
              <Link to="/about">GIÁ VÉ</Link>
            </li>
            <li>
              <Link to="/news">TIN MỚI VÀ ƯU ĐÃI</Link>
            </li>
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
      <div className="showtimes-container">
        <h1>Lịch Chiếu</h1>
        <div className="date-selection">
          <label htmlFor="date">Chọn Ngày:</label>
          <select
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={today.toISOString().split("T")[0]}
          />
          <span>
            {formattedDate} - {dayOfWeek}
          </span>
        </div>
        <div className="movie-selection">
          <label htmlFor="movie">Chọn Phim:</label>
          <select id="movie" value={selectedMovie} onChange={handleMovieChange}>
            <option value="">--Chọn Phim--</option>
            {movies.map((movie) => (
              <option key={movie._id} value={movie._id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
        <Link to={`/showtimes/${selectedMovie}`}>
          <button disabled={!selectedMovie}>Xem Lịch Chiếu</button>
        </Link>
      </div>
    </div>
  );
};

export default Showtimes;
