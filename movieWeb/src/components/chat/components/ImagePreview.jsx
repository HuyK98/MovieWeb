import { FaTimes } from 'react-icons/fa';
import '../ChatButton.css';

export default function ImagePreview({ src, onClose }) {
  // Ko render neu ko co anh
  if (!src) return null;

  return (
    <div className="image-preview-overlay" onClick={onClose}>
      <div className="image-preview-container">
        <button className="image-preview-close" onClick={onClose}>
          <FaTimes />
        </button>

        <img
          src={src}
          alt="Preview"
          className="image-preview-img"
          onClick={(e) => e.stopPropagation()} //ngan dong khi click vao anh
        />
      </div>
    </div>
  );
}