import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBars } from "react-icons/fa";
import "../styles_admin/ManageGenres.css";
import API_URL from "../api/config"; // Import API_URL từ file config
import HeaderAdmin from "./admin_layout/HeaderAdmin";
import Sidebar from "./admin_layout/Sidebar";

const ManageGenres = () => {
  const [genres, setGenres] = useState([]);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [error, setError] = useState(null);
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State để quản lý trạng thái collapse

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/movies`);
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
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <HeaderAdmin />
      <button
        className="collapse-button"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <FaBars />
      </button>

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
