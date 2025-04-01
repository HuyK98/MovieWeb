import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPlay } from "@fortawesome/free-solid-svg-icons";  
import "../styles/NowShowingMovies.css";

const AnimatedSection = ({ children, animation, delay }) => {
  const style = {
    animation: `${animation} 1s ease-in-out`,
    animationDelay: `${delay || 0}ms`,
    opacity: 1,
  };

  return <div style={style}>{children}</div>;
};

const NowShowingMovies = ({ visibleMovies, handleFeaturedPrev, handleFeaturedNext, handleTrailerClick }) => {
  return (
    <AnimatedSection animation="fade-up">
      <div className="featured-movies-section">
        <div className="section-header">
          <h2>Phim Đang Chiếu</h2>
          <div className="view-more">
            <a href="/movielist">Xem Thêm</a>
          </div>
        </div>
        <div className="featured-movies-container">
          <button onClick={handleFeaturedPrev} className="carousel-button prev">
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
          <button onClick={handleFeaturedNext} className="carousel-button next">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default NowShowingMovies;