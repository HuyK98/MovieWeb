export default function ImagePreviewModal({ src, onClose }) {
  if (!src) return null;
  return (
    <div className="image-overlay" onClick={onClose}>
      <img src={src} alt="Preview" />
    </div>
  );
}
