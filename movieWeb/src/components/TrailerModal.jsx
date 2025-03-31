import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const TrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  return (
    <div className="trailer-modal" onClick={onClose}>
      <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-trailer" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <video src={trailerUrl} controls autoPlay />
      </div>
    </div>
  );
};

export default TrailerModal;