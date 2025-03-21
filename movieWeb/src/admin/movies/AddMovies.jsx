import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaFilm, FaUser, FaTicketAlt, FaChartLine, FaSignOutAlt, FaCogs } from "react-icons/fa";
import { MdSchedule, MdTheaters, MdCategory, MdOutlineAddCircle, MdRemoveRedEye } from "react-icons/md";
import "../../styles/AddMovies.css";
import logo from "../../assets/logo.jpg";

const AddMovie = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);


  const toggleMoviesMenu = () => {
    setIsMoviesOpen(!isMoviesOpen);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Vui lòng chọn ảnh!");
      return;
    }

    if (!video) {
      alert("Vui lòng chọn video!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("releaseDate", releaseDate);
    formData.append("genre", genre);
    formData.append("image", image); // Đảm bảo tên trường là "image"
    formData.append("video", video); // Đảm bảo tên trường là "video"

    try {
      const response = await axios.post("http://localhost:5000/api/movies/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Phim đã thêm thành công!");
      navigate("/admin/movies");
    } catch (error) {
      console.error("Lỗi khi thêm phim:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <ul className="menu">
          <li>
            <Link to="/admin" className="menu-item">
              <FaCogs className="icon" /> General
            </Link>
          </li>

          <li>
            <div onClick={() => setIsMoviesOpen(!isMoviesOpen)} className="menu-item">
              <FaFilm className="icon" /> Quản lý phim {isMoviesOpen ? "▲" : "▼"}
            </div>
            {isMoviesOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/admin/movies"><MdRemoveRedEye className="icon-sub" /> Danh sách phim</Link>
                </li>
                <li>
                  <Link to="/admin/add-movie"><MdOutlineAddCircle className="icon-sub" /> Thêm phim</Link>
                </li>
                <li>
                  <Link to="/admin/movie-detail"><MdTheaters className="icon-sub" /> Xem chi tiết phim</Link>
                </li>
                <li>
                  <Link to="/admin/add-showtime"><MdSchedule className="icon-sub" /> Thêm lịch chiếu</Link>
                </li>          
              </ul>
            )}
          </li>
          <li><Link to="/admin/schedules" className="menu-item"><MdSchedule className="icon" /> Quản lý lịch chiếu</Link></li>
          <li><Link to="/admin/genres" className="menu-item"><MdCategory className="icon" /> Quản lý thể loại phim</Link></li>
          <li><Link to="/admin/users" className="menu-item"><FaUser className="icon" /> Quản lý người dùng</Link></li>
          <li><Link to="/admin/tickets" className="menu-item"><FaTicketAlt className="icon" /> Quản lý vé</Link></li>
          <li><Link to="/admin/revenue" className="menu-item"><FaChartLine className="icon" /> Quản lý doanh thu</Link></li>
          <li><Link to="/logout" className="menu-item logout"><FaSignOutAlt className="icon" /> Đăng xuất</Link></li>
        </ul>
      </aside>
      <div className="add-container">
        <h2>Thêm Phim Mới</h2>
        <form onSubmit={handleSubmit} className="movie-form">
          <label>Tiêu đề phim:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Mô tả:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Ngày phát hành:</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            required
          />

          <label>Thể loại:</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />

          <label>Chọn ảnh:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          {preview && <img src={preview} alt="Preview" className="preview-img" />}

          <label>Chọn video:</label>
          <input
            type="file"
            accept="video/mp4"
            onChange={handleVideoChange}
            required
          />

          <button className="add-btn" type="submit">Thêm Phim</button>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;
