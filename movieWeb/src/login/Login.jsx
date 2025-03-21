import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {FaGooglePlusG,FaFacebookF,FaGithub,FaLinkedinIn} from "react-icons/fa";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Thêm trạng thái để hiển thị thông báo thành công
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const response = await axios.post(
          "http://localhost:5000/api/auth/register",
          { name, email, password }
        );
        // Xử lý đăng ký thành công
        setSuccess("Đăng ký tài khoản thành công!"); // Hiển thị thông báo thành công
        setTimeout(() => {
          setIsRegister(false); // Chuyển về giao diện đăng nhập sau 2 giây
          setSuccess(null); // Xóa thông báo thành công
          navigate("/login");
        }, 2000);
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password }
        );
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        // Xử lý đăng nhập thành công
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

  return (
    <div className="login-page">
      <div
        className={`auth-container ${isRegister ? "active" : ""}`}
        id="auth-container"
      >
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Tạo Tài Khoản</h1>
            <div className="social-icons">
              <a href="#" className="icon">
                <FaGooglePlusG />
              </a>
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
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}{" "}
            {/* Hiển thị thông báo thành công */}
            <button type="submit">Đăng Ký</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Đăng Nhập</h1>
            <div className="social-icons">
              <a href="#" className="icon">
                <FaGooglePlusG />
              </a>
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
                Để giữ kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin
                cá nhân của bạn
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
                Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng
                tôi
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
  );
};

export default Login;
