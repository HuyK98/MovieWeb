
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaCogs,
  FaFilm,
  FaUser,
  FaTicketAlt,
  FaChartLine,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import {
  MdRemoveRedEye,
  MdOutlineAddCircle,
  MdTheaters,
  MdSchedule,
  MdCategory,
} from "react-icons/md";
import logo from "../assets/logo.jpg";
import "../styles/ManageGenres.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const ManageGenres = () => {
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [error, setError] = useState(null);
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State để quản lý trạng thái collapse

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/movies");
        const movies = response.data;

        // Get unique genres and group movies by genre
        const genresSet = new Set(movies.map((movie) => movie.genre));
        const genresArray = Array.from(genresSet);

        const groupedMovies = genresArray.reduce((acc, genre) => {
          acc[genre] = movies.filter((movie) => movie.genre === genre);
          return acc;
        }, {});

        setGenres(genresArray);
        setMoviesByGenre(groupedMovies);
      } catch (err) {
        console.error("Error loading movie list:", err);
        setError("Unable to load movie list.");
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className={`admin-dashboard ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <button
            className="collapse-button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <FaBars />
          </button>
        </div>

        <ul className="menu">
          <li>
            <Link
              to="/admin"
              className={`menu-item ${
                location.pathname === "/admin" ? "active" : ""
              }`}
            >
              <FaCogs className="icon" />
              {!isSidebarCollapsed && "General"}
            </Link>
          </li>

          <li>
            <div
              onClick={() => setIsMoviesOpen(!isMoviesOpen)}
              className={`menu-item ${isMoviesOpen ? "active" : ""}`}
            >
              <FaFilm className="icon" />
              {!isSidebarCollapsed &&
                `Quản lý phim ${isMoviesOpen ? "▲" : "▼"}`}
            </div>
            {isMoviesOpen && (
              <ul className="submenu">
                <li>
                  <Link
                    to="/admin/movies"
                    className={`submenu-item ${
                      location.pathname === "/admin/movies" ? "active" : ""
                    }`}
                  >
                    <MdRemoveRedEye className="icon-sub" />
                    {!isSidebarCollapsed && "Danh sách phim"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/add-movie"
                    className={`submenu-item ${
                      location.pathname === "/admin/add-movie" ? "active" : ""
                    }`}
                  >
                    <MdOutlineAddCircle className="icon-sub" />
                    {!isSidebarCollapsed && "Thêm phim"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/movie-detail"
                    className={`submenu-item ${
                      location.pathname === "/admin/movie-detail"
                        ? "active"
                        : ""
                    }`}
                  >
                    <MdTheaters className="icon-sub" />
                    {!isSidebarCollapsed && "Xem chi tiết phim"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/chat"
                    className={`submenu-item ${
                      location.pathname === "/admin/chat" ? "active" : ""
                    }`}
                  >
                    <FaUser className="icon" />
                    {!isSidebarCollapsed && "Chat với người dùng"}
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/admin/schedules"
              className={`menu-item ${
                location.pathname === "/admin/schedules" ? "active" : ""
              }`}
            >
              <MdSchedule className="icon" />
              {!isSidebarCollapsed && "Quản lý lịch chiếu"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/genres"
              className={`menu-item ${
                location.pathname === "/admin/genres" ? "active" : ""
              }`}
            >
              <MdCategory className="icon" />
              {!isSidebarCollapsed && "Quản lý thể loại phim"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`menu-item ${
                location.pathname === "/admin/users" ? "active" : ""
              }`}
            >
              <FaUser className="icon" />
              {!isSidebarCollapsed && "Quản lý người dùng"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/tickets"
              className={`menu-item ${
                location.pathname === "/admin/tickets" ? "active" : ""
              }`}
            >
              <FaTicketAlt className="icon" />
              {!isSidebarCollapsed && "Quản lý vé"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/bills"
              className={`menu-item ${
                location.pathname === "/admin/bills" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="icon" />
              {!isSidebarCollapsed && "Quản lý hóa đơn"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/revenue"
              className={`menu-item ${
                location.pathname === "/admin/revenue" ? "active" : ""
              }`}
            >
              <FaChartLine className="icon" />
              {!isSidebarCollapsed && "Quản lý doanh thu"}
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className={`menu-item logout ${
                location.pathname === "/logout" ? "active" : ""
              }`}
            >
              <FaSignOutAlt className="icon" />
              {!isSidebarCollapsed && "Đăng xuất"}
            </Link>
          </li>
        </ul>
      </aside>

      <div className="manage-genres">
        <h1>Movie Genre Management</h1>
        {error && <p className="error">{error}</p>}
        {genres.length > 0 ? (
          genres.map((genre) => (
            <div key={genre} className="genre-section">
              <h2>{genre}</h2>
              <div className="genre-grid">
                {moviesByGenre[genre].map((movie) => (
                  <div key={movie._id} className="genre-item">
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      className="genre-image"
                    />
                    <h3>{movie.title}</h3>
                    <p>{movie.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No genres available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageGenres;
