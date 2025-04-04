import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FaUser, FaGem, FaTicketAlt, FaSignOutAlt, FaCaretDown } from "react-icons/fa";

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

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div>
        <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
          <Header
            user={user}
            handleLogout={handleLogout}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />
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
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
