export default function ImagePreviewModal({ src, onClose, onNext, onPrev, hasNext, hasPrev }) {
  if (!src) return null;

  const handleClick = (e) => {
    // Ngăn việc đóng modal khi click vào ảnh hoặc nút
    e.stopPropagation();
  };

  return (
    <div className="image-overlay" onClick={onClose}>
      <div className="image-container" onClick={handleClick}>
        {hasPrev && (
          <button className="nav-arrow prev" onClick={onPrev}>
            ‹
          </button>
        )}
        
        <img src={src} alt="Preview" />
        
        {hasNext && (
          <button className="nav-arrow next" onClick={onNext}>
            ›
          </button>
        )}
      </div>
    </div>
  );
}