import { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaImage, FaLink } from 'react-icons/fa';
import { getMediaAPI } from "../services/chat.api";
import ImagePreviewModal from './ImagePreviewModal';
import '../styles/ChatHeader.css';

export default function ChatHeader({ user, onSearchClick }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('image'); // 'image' hoac 'link'
  const [mediaData, setMediaData] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch media khi doi tab hoac mo panel
  useEffect(() => {
    if (isPanelOpen && user?._id) {
      fetchMedia(activeMediaTab);
    }
  }, [activeMediaTab, isPanelOpen, user]);

  const fetchMedia = async (type) => {
    try {
      setLoadingMedia(true);
      const response = await getMediaAPI(user._id, type);
      setMediaData(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy media:', error);
      setMediaData([]);
    } finally {
      setLoadingMedia(false);
    }
  };

  return (
    <div className="chat-header-modern">
      <img
        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
        alt={user.name}
        className="user-avatar-modern"
        onClick={() => setIsPanelOpen(true)}
      />
      <h3>{user.name}</h3>

      {/* Panel */}
      {isPanelOpen && (
        <div className="chat-detail-panel">
          <div className="panel-header">
            <h4>Thông tin & Tìm kiếm</h4>
            <button onClick={() => setIsPanelOpen(false)}><FaTimes /></button>
          </div>

          {/* User Info */}
          <div className="user-info">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`}
              alt={user.name}
              className="user-avatar-large"
            />
            <p><strong>{user.name}</strong></p>
            <p>{user.email}</p>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <div className="search-bar">
              <FaSearch />
              <input
                type="text"
                placeholder="Tìm tin nhắn..."
                onChange={(e) => onSearchClick(e.target.value)}
              />
            </div>
          </div>

          {/* Media section */}
          <div className="media-section">
            <h5 className="section-title">File phương tiện</h5>

            {/* Tabs */}
            <div className="media-tabs">
              <button
                className={`media-tab ${activeMediaTab === 'image' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('image')}
              >
                <FaImage /> Ảnh
              </button>
              <button
                className={`media-tab ${activeMediaTab === 'link' ? 'active' : ''}`}
                onClick={() => setActiveMediaTab('link')}
              >
                <FaLink /> Liên kết
              </button>
            </div>

            {/* Content */}
            <div className="media-content">
              {loadingMedia ? (
                <div className="loading-state">Đang tải...</div>
              ) : mediaData.length === 0 ? (
                <div className="empty-state">
                  {activeMediaTab === 'image' ? 'Chưa có ảnh nào' : 'Chưa có liên kết nào'}
                </div>
              ) : (
                <>
                  {/* Hien thi image */}
                  {activeMediaTab === 'image' && (
                    <>
                      <div className="image-grid">
                        {mediaData.slice(0, 6).map((msg, idx) => (
                          <div key={idx} className="image-item">
                            <img
                              src={msg.imageUrl}
                              alt={msg.imageName || 'Image'}
                              onClick={() => {
                                setCurrentImageIndex(idx);
                                setPreviewImage(msg.imageUrl);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {previewImage && (
                        <ImagePreviewModal
                          src={mediaData[currentImageIndex].imageUrl}
                          onClose={() => {
                            setPreviewImage(null);
                            setCurrentImageIndex(0);
                          }}
                          onNext={() => setCurrentImageIndex(prev => prev + 1)}
                          onPrev={() => setCurrentImageIndex(prev => prev - 1)}
                          hasNext={currentImageIndex < mediaData.length - 1}
                          hasPrev={currentImageIndex > 0}
                        />
                      )}
                    </>
                  )}

                  {/* Hien thi link */}
                  {activeMediaTab === 'link' && (
                    <div className="link-list">
                      {mediaData.slice(0, 5).map((msg, idx) => (
                        <div key={idx} className="link-item">
                          <FaLink className="link-icon" />
                          <div className="link-details">
                            {msg.links && msg.links.map((link, i) => (
                              <a
                                key={i}
                                href={link.startsWith('www') ? `https://${link}` : link}  //link bat dau bang www doi thanh https://
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-url"
                              >
                                {link.length > 35 ? link.substring(0, 35) + '...' : link}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show more */}
                  {mediaData.length > (activeMediaTab === 'image' ? 6 : 5) && (
                    <div className="show-more">
                      +{mediaData.length - (activeMediaTab === 'image' ? 6 : 5)} {activeMediaTab === 'image' ? 'ảnh' : 'liên kết'} khác
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}