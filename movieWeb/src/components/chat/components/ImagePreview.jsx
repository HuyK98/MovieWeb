export default function ImagePreview({ imageUrl, onClose }) {
  if (!imageUrl) return null;

  return (
    <div className="image-overlay" onClick={onClose}>
      <div className="image-preview-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Preview" />
        <button className="close-preview" onClick={onClose}>×</button>
      </div>
    </div>
  );
}