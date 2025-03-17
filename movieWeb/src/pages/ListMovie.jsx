import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
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
import { faPlay, faTimes, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

// Hook để kiểm tra khi phần tử xuất hiện trong viewport
const handleLogout = () => {
  localStorage.removeItem("userInfo");
  setUser(null);
  navigate("/");
};

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
const AnimatedSection = ({ children, animation = "fade-up", delay = 0, threshold = 0.1 }) => {
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
                : "translateY(50px)"
      }}
    >
      {children}
    </div>
  );
};

const Home = () => {
  const [currentPoster, setCurrentPoster] = useState(0);
  const posters = [poster1, poster2, poster3, poster4, poster5];
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [user, setUser] = useState(null);

  // Auto-rotate poster carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate featured movies carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % (movies.length > 5 ? movies.length - 4 : 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

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

    // Thêm CSS để hỗ trợ các hiệu ứng animation
    const style = document.createElement('style');
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
    setFeaturedIndex((prev) => (prev === 0 ? (movies.length > 5 ? movies.length - 5 : 0) : prev - 1));
  };

  const handleFeaturedNext = () => {
    setFeaturedIndex((prev) => (prev >= (movies.length > 5 ? movies.length - 5 : 0) ? 0 : prev + 1));
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
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />

      <div className="poster-container">
        <button onClick={handlePrev} className="arrow-button prev">{"<"}</button>
        <img src={posters[currentPoster]} alt="Poster" className="poster" />
        <button onClick={handleNext} className="arrow-button next">{">"}</button>
      </div>

      {/* Featured Movies Carousel với animation */}
      <AnimatedSection animation="fade-up">
        <div className="featured-movies-section">
          <div className="section-header">
            <h2>Phim Đang Chiếu</h2>
            <div className="view-more">
              <Link to="/movielist">Xem Thêm</Link>
            </div>
          </div>
          <div className="featured-movies-container">
            <button onClick={handleFeaturedPrev} className="carousel-button prev">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="featured-movies-slider">
              {filteredMovies.length > 0 && filteredMovies.slice(featuredIndex, featuredIndex + 5).map((movie, index) => (
                <AnimatedSection key={movie._id} animation="fade-up" delay={index * 100}>
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
                    <p className="movie-year">({new Date(movie.releaseDate).getFullYear()})</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            <button onClick={handleFeaturedNext} className="carousel-button next">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Horizontal row of movies với animation */}
      <AnimatedSection animation="fade-left" delay={200}>
        <div className="movie-row-section">
          <div className="section-header">
            <h2>Phim Sắp Ra Mắt</h2>
            <div className="view-more">
              <Link to="/cartoon">Xem Thêm</Link>
            </div>
          </div>
          <div className="movie-row-container">
            {filteredMovies.length > 0 ? (
              filteredMovies.slice(0, 8).map((movie, index) => (
                <AnimatedSection key={movie._id} animation="fade-up" delay={index * 100}>
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
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </div>
  );
};

export default Home;