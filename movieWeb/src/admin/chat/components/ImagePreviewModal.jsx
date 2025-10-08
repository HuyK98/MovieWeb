export default function ImagePreviewModal({ src, onClose }) {
  return (
    <div className="image-overlay" onClick={onClose}>
      <img src={src} alt="Preview" />
    </div>
  );
}
