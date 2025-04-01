import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPlay } from "@fortawesome/free-solid-svg-icons";
import "../styles/UpcomingMovies.css";

const AnimatedSection = ({ children, animation, delay }) => {
  const style = {
    animation: `${animation} 1s ease-in-out`,
    animationDelay: `${delay || 0}ms`,
    opacity: 1,
  };

  return <div style={style}>{children}</div>;
};

const UpcomingMovies = ({ visibleUpcomingMovies, handleUpcomingPrev, handleUpcomingNext, handleTrailerClick }) => {
  return (
    <AnimatedSection animation="fade-left">
      <div className="movie-row-section">
        <div className="section-header">
          <button onClick={handleUpcomingPrev} className="carousel-button prev">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2>Phim Sắp Ra Mắt</h2>
          <div className="view-more">
            <a href="/movielist">Xem Thêm</a>
          </div>
        </div>
        <div className="movie-row-container">
          {visibleUpcomingMovies.map((movie, index) => (
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
                <h3 className="movie-title1">{movie.title}</h3>
                <p className="movie-year">
                  ({new Date(movie.releaseDate).getFullYear()})
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
        <button onClick={handleUpcomingNext} className="carousel-button next">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </AnimatedSection>
  );
};

export default UpcomingMovies;