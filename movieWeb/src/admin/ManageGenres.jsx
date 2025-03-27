import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    FaCogs, FaFilm, FaUser, FaTicketAlt, FaChartLine, FaSignOutAlt
} from "react-icons/fa";
import {
    MdRemoveRedEye, MdOutlineAddCircle, MdTheaters,
    MdSchedule, MdCategory
} from "react-icons/md";
import logo from "../assets/logo.jpg";
import "../styles/ManageGenres.css";

const ManageGenres = () => {
    const [genres, setGenres] = useState([]);
    const [moviesByGenre, setMoviesByGenre] = useState({});
    const [error, setError] = useState(null);
    const [isMoviesOpen, setIsMoviesOpen] = useState(false);

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
        <div className="admin-dashboard">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="logo" />
                    </Link>
                </div>

                <ul className="menu">
                    <li>
                        <Link to="/admin" className="menu-item">
                            <FaCogs className="icon" /> General
                        </Link>
                    </li>

                    <li>
                        <div onClick={() => setIsMoviesOpen(!isMoviesOpen)} className="menu-item">
                            <FaFilm className="icon" /> Quản lý phim {isMoviesOpen ? "▲" : "▼"}
                        </div>
                        {isMoviesOpen && (
                            <ul className="submenu">
                                <li>
                                    <Link to="/admin/movies"><MdRemoveRedEye className="icon-sub" /> Danh sách phim</Link>
                                </li>
                                <li>
                                    <Link to="/admin/add-movie"><MdOutlineAddCircle className="icon-sub" /> Thêm phim</Link>
                                </li>
                                <li>
                                    <Link to="/admin/movie-detail"><MdTheaters className="icon-sub" /> Xem chi tiết phim</Link>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li><Link to="/admin/schedules" className="menu-item"><MdSchedule className="icon" /> Quản lý lịch chiếu</Link></li>
                    <li><Link to="/admin/genres" className="menu-item"><MdCategory className="icon" /> Quản lý thể loại phim</Link></li>
                    <li><Link to="/admin/users" className="menu-item"><FaUser className="icon" /> Quản lý người dùng</Link></li>
                    <li><Link to="/admin/tickets" className="menu-item"><FaTicketAlt className="icon" /> Quản lý vé</Link></li>
                    <li><Link to="/admin/revenue" className="menu-item"><FaChartLine className="icon" /> Quản lý doanh thu</Link></li>
                    <li><Link to="/logout" className="menu-item logout"><FaSignOutAlt className="icon" /> Đăng xuất</Link></li>
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
                                        <img src={movie.imageUrl} alt={movie.title} className="genre-image" />
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