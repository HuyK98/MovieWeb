import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faHeart } from "@fortawesome/free-solid-svg-icons";

const MovieItem = ({
  movie,
  index,
  favorites,
  handleFavoriteClick,
  handleTrailerClick,
  handleBuyTicketClick,
  navigate,
  translations,
  language,
  AnimatedSection,
}) => (
  <AnimatedSection key={movie._id} animation="fade-up" delay={index * 100}>
    <div className="movie-item">
      <div className="movie-image-container">
        <img src={movie.imageUrl} alt={movie.title} />
        <button
          className={`favorite-button ${
            favorites.some((fav) => fav._id === movie._id) ? "active" : ""
          }`}
          onClick={() => handleFavoriteClick(movie)}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
        <button
          className="trailer-button"
          onClick={() => handleTrailerClick(movie.videoUrl)}
        >
          <FontAwesomeIcon icon={faPlay} style={{ marginRight: "8px" }} />
          {translations[language].trailer}
        </button>
      </div>
      <div className="movie-title">
        <h3
          className="movie-title-link"
          onClick={() => navigate(`/movie/${movie._id}`)}
        >
          {movie.title}
        </h3>
        <p>
          {translations[language].genre}: {movie.genre}
        </p>
        <p>
          {translations[language].duration}: {movie.description}
        </p>
        <p>
          {translations[language].releaseDate}:{" "}
          {new Date(movie.releaseDate).toLocaleDateString()}
        </p>
      </div>
      <button
        className="card-button"
        onClick={() => handleBuyTicketClick(movie)}
      >
        {translations[language].buyTicket}
      </button>
    </div>
  </AnimatedSection>
);

export default MovieItem;