import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/PosterSection.css";

const PosterSection = ({ movies }) => {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [thumbnailIndex, setThumbnailIndex] = useState(0); // Tracks the starting index of visible thumbnails

  useEffect(() => {
    if (movies.length > 0) {
      setSelectedMovie(movies[0]);
    }
  }, [movies]);

  const handlePrev = () => {
    setThumbnailIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setThumbnailIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="poster-section">
      {/* Main Poster */}
      <img
        src={selectedMovie.imageUrl}
        alt={selectedMovie.title}
        className="poster-background"
      />
      <div className="main-poster">
        {/* Poster Details */}
        <div className="poster-details">
          <h2 className="poster-title">{selectedMovie.title}</h2>
          <p className="poster-genre">Thể loại: {selectedMovie.genre}</p>
          <p className="poster-description">{selectedMovie.description}</p>
          <p className="poster-release-date">
            Ngày phát hành:{" "}
            {new Date(selectedMovie.releaseDate).toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Trailer Iframe */}
        <div className="trailer-container">
          <iframe
            src={selectedMovie.videoUrl}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="trailer-iframe"
          ></iframe>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="thumbnail-section">
        <button className="thumbnail-prev" onClick={handlePrev}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {movies
          .slice(thumbnailIndex, thumbnailIndex + 8)
          .concat(
            thumbnailIndex + 8 > movies.length
              ? movies.slice(0, (thumbnailIndex + 8) % movies.length)
              : []
          )
          .map((movie) => (
            <div
              key={movie._id}
              className={`thumbnail ${
                selectedMovie._id === movie._id ? "active" : ""
              }`}
              onClick={() => setSelectedMovie(movie)}
            >
              <img src={movie.imageUrl} alt={movie.title} />
            </div>
          ))}

        <button className="thumbnail-next" onClick={handleNext}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default PosterSection;