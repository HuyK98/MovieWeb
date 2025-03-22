import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTimes,
  faSearch,
  faSun,
  faMoon,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faYoutube,
  faTiktok,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          { name, email, password, phone }
        );
        setSuccess("Đăng ký tài khoản thành công!");
        setTimeout(() => {
          setIsRegister(false);
          setSuccess(null);
          navigate("/login");
        }, 2000);
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password }
        );
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        if (response.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(
        isRegister
          ? "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin."
          : "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response;

        // Kiểm tra xem credential có tồn tại và không rỗng
      if (!credential) {
        setError("Token ID không hợp lệ. Vui lòng thử lại.");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/google-login", {
        tokenId: credential,
      });
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google Login Failure:", response);
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    }
  };

  const handleGoogleLoginFailure = (response) => {
    setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div>
        <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
          <header>
            <Link to="/">
              <img src={logo} alt="Logo" className="logo" />
            </Link>
            <nav>
              <ul>
                <li>
                  <Link to="/showtimes">LỊCH CHIẾU THEO RẠP</Link>
                </li>
                <li>
                  <Link to="/movielist">PHIM</Link>
                </li>
                <li>
                  <Link to="/place">RẠP</Link>
                </li>
                <li>
                  <Link to="/about">GIÁ VÉ</Link>
                </li>
                <li>
                  <Link to="/news">TIN MỚI VÀ ƯU ĐÃI</Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <span>Xin chào, {user.name}</span>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Đăng xuất</button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                )}
              </ul>
            </nav>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </header>
          <div className="login-page">
            <div
              className={`auth-container ${isRegister ? "active" : ""}`}
              id="auth-container"
            >
              <div className="form-container sign-up">
                <form onSubmit={handleSubmit}>
                  <h1>Tạo Tài Khoản</h1>
                  <div className="social-icons">
                    <GoogleLogin
                      clientId={googleClientId}
                      buttonText="Đăng nhập bằng Google"
                      onSuccess={handleGoogleLoginSuccess}
                      onFailure={handleGoogleLoginFailure}
                      cookiePolicy={"single_host_origin"}
                      render={(renderProps) => (
                        <a
                          href="#"
                          className="icon"
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                        >
                          <FaGooglePlusG />
                        </a>
                      )}
                    />
                    <a href="#" className="icon">
                      <FaFacebookF />
                    </a>
                    <a href="#" className="icon">
                      <FaGithub />
                    </a>
                    <a href="#" className="icon">
                      <FaLinkedinIn />
                    </a>
                  </div>
                  <span>hoặc sử dụng email của bạn để đăng ký</span>
                  <input
                    type="text"
                    placeholder="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  {error && <p className="error">{error}</p>}
                  {success && <p className="success">{success}</p>}
                  <button type="submit">Đăng Ký</button>
                </form>
              </div>
              <div className="form-container sign-in">
                <form onSubmit={handleSubmit}>
                  <h1>Đăng Nhập</h1>
                  <div className="social-icons">
                    <GoogleLogin
                      clientId={googleClientId}
                      buttonText="Đăng nhập bằng Google"
                      onSuccess={handleGoogleLoginSuccess}
                      onFailure={handleGoogleLoginFailure}
                      cookiePolicy={"single_host_origin"}
                      render={(renderProps) => (
                        <a
                          href="#"
                          className="icon"
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                        >
                          <FaGooglePlusG />
                        </a>
                      )}
                    />
                    <a href="#" className="icon">
                      <FaFacebookF />
                    </a>
                    <a href="#" className="icon">
                      <FaGithub />
                    </a>
                    <a href="#" className="icon">
                      <FaLinkedinIn />
                    </a>
                  </div>
                  <span>hoặc sử dụng email và mật khẩu của bạn</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {error && <p className="error">{error}</p>}
                  <a href="#">Quên mật khẩu?</a>
                  <button type="submit">Đăng Nhập</button>
                </form>
              </div>
              <div className="toggle-container">
                <div className="toggle">
                  <div className="toggle-panel toggle-left">
                    <h1>Chào Mừng Trở Lại!</h1>
                    <p>
                      Để giữ kết nối với chúng tôi, vui lòng đăng nhập bằng
                      thông tin cá nhân của bạn
                    </p>
                    <button
                      className="hidden"
                      id="login"
                      onClick={() => setIsRegister(false)}
                    >
                      Đăng Nhập
                    </button>
                  </div>
                  <div className="toggle-panel toggle-right">
                    <h1>Xin Chào, Bạn!</h1>
                    <p>
                      Nhập thông tin cá nhân của bạn và bắt đầu hành trình với
                      chúng tôi
                    </p>
                    <button
                      className="hidden"
                      id="register"
                      onClick={() => setIsRegister(true)}
                    >
                      Đăng Ký
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-section left">
              <h3>CÁC RẠP Cinema</h3>
              <ul>
                <li>Cinema Xuân Thủy, Hà Nội - Hotline: 033 023 183</li>
                <li>Cinema Tây Sơn, Hà Nội - Hotline: 097 694 713</li>
                <li>
                  Cinema Nguyễn Trãi, TP. Hồ Chí Minh - Hotline: 070 675 509
                </li>
                <li>
                  Cinema Quang Trung, TP. Hồ Chí Minh - Hotline: 090 123 456
                </li>
                <li>Cinema Đống Đa, Hà Nội - Hotline: 098 765 432</li>
                <li>Cinema Cầu Giấy, Hà Nội - Hotline: 098 765 432</li>
              </ul>
            </div>
            <div className="footer-section center">
              <Link to="/">
                <img src={logo} alt="Logo" className="logo" />
              </Link>
              <p>© 2021 Cinema Media. All Rights Reserved</p>
              <button className="toggle-button" onClick={toggleDarkMode}>
                {darkMode ? (
                  <FontAwesomeIcon icon={faSun} />
                ) : (
                  <FontAwesomeIcon icon={faMoon} />
                )}
                {darkMode ? " Light Mode" : " Dark Mode"}
              </button>
            </div>
            <div className="footer-section right">
              <h3>KẾT NỐI VỚI CHÚNG TÔI</h3>
              <div className="social-links">
                <a href="#" className="facebook">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" className="youtube">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
                <a href="#" className="tiktok">
                  <FontAwesomeIcon icon={faTiktok} />
                </a>
                <a href="#" className="instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </div>
              <h3>LIÊN HỆ</h3>
              <p>CÔNG TY CỔ PHẦN CINEMA MEDIA</p>
              <p>Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
              <p>Hotline: 1800 123 456</p>
              <p>Email: info@cinemamedia.vn</p>
            </div>
          </div>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
