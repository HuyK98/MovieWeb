import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles_admin/MovieList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  FaBars,
} from "react-icons/fa";
import API_URL from "../../api/config"; // Import API_URL từ file config
import HeaderAdmin from "../admin_layout/HeaderAdmin";
import Sidebar from "../admin_layout/Sidebar";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddShowtimeModal, setShowAddShowtimeModal] = useState(false);
  const [selectedMovieForShowtime, setSelectedMovieForShowtime] =
    useState(null);
  const [showtimeDate, setShowtimeDate] = useState("");
  const [showtimeTime, setShowtimeTime] = useState("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State để quản lý trạng thái collapse

  // Kiểm tra nếu `location.pathname` thuộc submenu "Quản lý phim"
  useEffect(() => {
    if (
      location.pathname === "/admin/movies" ||
      location.pathname === "/admin/add-movie" ||
      location.pathname === "/admin/movie-detail" ||
      location.pathname === "/admin/chat"
    ) {
      setIsMoviesOpen(true); // Giữ trạng thái mở
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/movies`);
        // console.log("Movies fetched:", response.data);
        if (Array.isArray(response.data)) {
          setMovies(response.data);
        } else {
          console.error("API response is not an array:", response.data);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Không thể tải danh sách phim");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const toggleMoviesMenu = () => {
    setIsMoviesOpen(!isMoviesOpen);
  };

  const handleTrailerClick = (videoUrl) => {
    window.open(videoUrl, "_blank");
  };

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setShowDeleteConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/movies/${movieToDelete._id}`
      );
      console.log("Delete response:", response.data);
      setMovies(movies.filter((movie) => movie._id !== movieToDelete._id));
      setShowDeleteConfirmModal(false);
      setMovieToDelete(null);
    } catch (err) {
      console.error("Error deleting movie:", err.response?.data || err.message);
      setError("Không thể xóa phim");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false);
    setMovieToDelete(null);
  };

  const handleEditClick = (movie) => {
    setEditMovie(movie);
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editMovie.title);
    formData.append("description", editMovie.description);
    formData.append("releaseDate", editMovie.releaseDate);
    formData.append("genre", editMovie.genre);
    if (editMovie.image) formData.append("image", editMovie.image);
    if (editMovie.video) formData.append("video", editMovie.video);

    try {
      const response = await axios.put(
        `${API_URL}/api/movies/${editMovie._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Update response:", response.data);
      setMovies(
        movies.map((movie) =>
          movie._id === editMovie._id ? response.data : movie
        )
      );
      setShowEditModal(false);
      setEditMovie(null);
    } catch (err) {
      console.error("Error updating movie:", err.response?.data || err.message);
      setError("Không thể cập nhật phim");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditMovie({ ...editMovie, image: file });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setEditMovie({ ...editMovie, video: file });
  };

  const handleAddShowtimeClick = (movie) => {
    setSelectedMovieForShowtime(movie);
    setShowAddShowtimeModal(true);
  };

  const handleCloseAddShowtimeModal = () => {
    setShowAddShowtimeModal(false);
    setSelectedMovieForShowtime(null);
    setShowtimeDate("");
    setShowtimeTime("");
  };

  const handleAddShowtimeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/showtimes`, {
        movieId: selectedMovieForShowtime._id,
        date: showtimeDate,
        time: showtimeTime,
        seats: 70, // thêm số ghế mặc định hoặc lấy từ input
      });
      alert("Lịch chiếu đã được thêm thành công!");
      handleCloseAddShowtimeModal();
    } catch (error) {
      console.error("Lỗi khi thêm lịch chiếu:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowAddShowtimeModal(false);
    setShowDeleteConfirmModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    const handleClickOutside = (e) => {
      if (e.target.className === "modal") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  if (loading) return <div>Đang tải danh sách phim...</div>;
  if (error) return <div>{error}</div>;
    

  return (
    <div className={`admin-dashboard ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <HeaderAdmin />
      <button
        className="collapse-button"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <FaBars />
      </button>
      <div className="card-items">
        <h2>Danh sách phim</h2>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="movies-list">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div key={movie._id} className="movie-item">
                  <div className="movie-image-container">
                    <img src={movie.imageUrl} alt={movie.title} />
                    <button
                      className="trailer-button"
                      onClick={() => handleTrailerClick(movie.videoUrl)}
                    >
                      <FontAwesomeIcon
                        icon={faPlay}
                        style={{ marginRight: "8px" }}
                      />
                      Trailer
                    </button>
                  </div>
                  <h3>{movie.title}</h3>
                  <p>Thể Loại: {movie.genre}</p>
                  <p>Thời Lượng: {movie.description}</p>
                  <p>
                    Ngày phát hành:{" "}
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </p>
                  <div className="movie-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(movie)}
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ marginRight: "8px" }}
                      />
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(movie)}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ marginRight: "8px" }}
                      />
                      Delete
                    </button>
                    <button
                      className="add-showtime-button"
                      onClick={() => handleAddShowtimeClick(movie)}
                    >
                      Add Showtime
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có phim nào</p>
            )}
          </div>
        )}
      </div>

      {/* Modal chỉnh sửa */}
      {showEditModal && editMovie && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              X
            </button>
            <h2>Chỉnh sửa phim</h2>
            <form onSubmit={handleUpdateSubmit} className="movie-form">
              <label>Tiêu đề phim:</label>
              <input
                type="text"
                value={editMovie.title}
                onChange={(e) =>
                  setEditMovie({ ...editMovie, title: e.target.value })
                }
                required
              />

              <label>Mô tả:</label>
              <textarea
                value={editMovie.description}
                onChange={(e) =>
                  setEditMovie({ ...editMovie, description: e.target.value })
                }
                required
              />

              <label>Ngày phát hành:</label>
              <input
                type="date"
                value={
                  new Date(editMovie.releaseDate).toISOString().split("T")[0]
                }
                onChange={(e) =>
                  setEditMovie({ ...editMovie, releaseDate: e.target.value })
                }
                required
              />

              <label>Thể loại:</label>
              <input
                type="text"
                value={editMovie.genre}
                onChange={(e) =>
                  setEditMovie({ ...editMovie, genre: e.target.value })
                }
                required
              />

              <label>Chọn ảnh mới (nếu muốn thay đổi):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <img
                src={editMovie.imageUrl}
                alt="Current"
                className="preview-img"
              />

              <label>Chọn video mới (nếu muốn thay đổi):</label>
              <input
                type="file"
                accept="video/mp4"
                onChange={handleVideoChange}
              />

              <button className="add-btn" type="submit">
                Cập nhật
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal thêm lịch chiếu */}
      {showAddShowtimeModal && selectedMovieForShowtime && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              X
            </button>
            <h2>Thêm Lịch Chiếu - {selectedMovieForShowtime.title}</h2>
            <form onSubmit={handleAddShowtimeSubmit} className="showtime-form">
              <label>Ngày chiếu:</label>
              <input
                type="date"
                value={showtimeDate}
                onChange={(e) => setShowtimeDate(e.target.value)}
                required
              />

              <label>Giờ chiếu:</label>
              <input
                type="time"
                value={showtimeTime}
                onChange={(e) => setShowtimeTime(e.target.value)}
                required
              />

              <button className="add-btn" type="submit">
                Thêm Lịch Chiếu
              </button>
              <button
                className="cancel-btn"
                type="button"
                onClick={handleCloseAddShowtimeModal}
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showDeleteConfirmModal && movieToDelete && (
        <div className="modal">
          <div className="modal-content">
            <h2>Bạn có chắc chắn xóa không?</h2>
            <div className="confirm-buttons">
              <button className="confirm-btn" onClick={handleConfirmDelete}>
                Yes
              </button>
              <button className="cancel-btn" onClick={handleCancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;
