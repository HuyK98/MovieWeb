import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { FaGooglePlusG } from "react-icons/fa";
import { useLanguage } from "../pages/LanguageContext"; // Import context
import API_URL from "../api/config"; // Import API_URL từ config

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
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation(); // Lấy thông tin state từ navigate
  const { language } = useLanguage(); // Lấy ngôn ngữ từ context

  const texts = {
    vi: {
      createAccount: "Tạo Tài Khoản",
      login: "Đăng Nhập",
      registerWithGoogle: "Đăng nhập bằng Google",
      orUseEmail: "hoặc sử dụng email của bạn để đăng ký",
      name: "Tên",
      email: "Email",
      password: "Mật khẩu",
      phone: "Số điện thoại",
      register: "Đăng Ký",
      orUseEmailAndPassword: "hoặc sử dụng email và mật khẩu của bạn",
      forgotPassword: "Quên mật khẩu?",
      welcomeBack: "Chào Mừng Trở Lại!",
      connectWithPersonalDetails: "Để giữ kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn",
      loginButton: "Đăng Nhập",
      helloFriend: "Xin Chào, Bạn!",
      enterPersonalDetails: "Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi",
      registerButton: "Đăng Ký",
      registerSuccess: "Đăng ký tài khoản thành công!",
      registerFailure: "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.",
      loginFailure: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      googleLoginFailure: "Đăng nhập bằng Google thất bại. Vui lòng thử lại.",
      invalidToken: "Token ID không hợp lệ. Vui lòng thử lại.",
    },
    en: {
      createAccount: "Create Account",
      login: "Login",
      registerWithGoogle: "Login with Google",
      orUseEmail: "or use your email for registration",
      name: "Name",
      email: "Email",
      password: "Password",
      phone: "Phone Number",
      register: "Register",
      orUseEmailAndPassword: "or use your email and password",
      forgotPassword: "Forgot password?",
      welcomeBack: "Welcome Back!",
      connectWithPersonalDetails: "To keep connected with us, please login with your personal info",
      loginButton: "Login",
      helloFriend: "Hello, Friend!",
      enterPersonalDetails: "Enter your personal details and start journey with us",
      registerButton: "Register",
      registerSuccess: "Account registration successful!",
      registerFailure: "Registration failed. Please check your information.",
      loginFailure: "Login failed. Please check your information.",
      googleLoginFailure: "Google login failed. Please try again.",
      invalidToken: "Invalid token ID. Please try again.",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        const response = await axios.post(
          `${API_URL}/api/auth/register`,
          { name, email, password, phone }
        );
        setSuccess(texts[language].registerSuccess);
        setTimeout(() => {
          setIsRegister(false);
          setSuccess(null);
          navigate("/login");
        }, 2000);
      } else {
        const response = await axios.post(
          `${API_URL}/api/auth/login`,
          { email, password }
        );
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        // Kiểm tra vai trò của người dùng
        if (response.data.role === "admin") {
          navigate("/admin");
        } else {
          // Kiểm tra xem có thông tin bookingInfo trong state không
          const state = location.state;
          if (state && state.bookingInfo) {
            // Chuyển hướng đến trang movie-detail với thông tin bookingInfo
            navigate("/movie-detail", {
              state: { bookingInfo: state.bookingInfo },
            });
          } else {
            // Nếu không có thông tin bookingInfo, chuyển hướng đến trang chính
            navigate("/");
          }
        }
      }
    } catch (err) {
      setError(
        isRegister
          ? texts[language].registerFailure
          : texts[language].loginFailure
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
        setError(texts[language].invalidToken);
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/auth/google-login`,
        {
          tokenId: credential,
        }
      );
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        // Kiểm tra xem có thông tin bookingInfo trong state không
        const state = location.state;
        if (state && state.bookingInfo) {
          // Chuyển hướng đến trang movie-detail với thông tin bookingInfo
          navigate("/movie-detail", {
            state: { bookingInfo: state.bookingInfo },
          });
        } else {
          // Nếu không có thông tin bookingInfo, chuyển hướng đến trang chính
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Google Login Failure:", response);
      setError(texts[language].googleLoginFailure);
    }
  };

  const handleGoogleLoginFailure = (response) => {
    setError(texts[language].googleLoginFailure);
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

  //scroll header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div>
        <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
          <Header
            user={user}
            handleLogout={handleLogout}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
            isScrolled={isScrolled}
          />
          <div className="home-content">
            <div className="login-page">
              <div
                className={`auth-container ${isRegister ? "active" : ""}`}
                id="auth-container"
              >
                <div className="form-container sign-up">
                  <form onSubmit={handleSubmit}>
                    <h1>{texts[language].createAccount}</h1>
                    <div className="social-icons">
                      <GoogleLogin
                        clientId={googleClientId}
                        buttonText={texts[language].registerWithGoogle}
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
                    <span>{texts[language].orUseEmail}</span>
                    <input
                      type="text"
                      placeholder={texts[language].name}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      placeholder={texts[language].email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder={texts[language].password}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder={texts[language].phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <button type="submit">{texts[language].register}</button>
                  </form>
                </div>
                <div className="form-container sign-in">
                  <form onSubmit={handleSubmit}>
                    <h1>{texts[language].login}</h1>
                    <div className="social-icons">
                      <GoogleLogin
                        clientId={googleClientId}
                        buttonText={texts[language].registerWithGoogle}
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
                    <span>{texts[language].orUseEmailAndPassword}</span>
                    <input
                      type="email"
                      placeholder={texts[language].email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <input
                      type="password"
                      placeholder={texts[language].password}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {error && <p className="error">{error}</p>}
                    <a href="#">{texts[language].forgotPassword}</a>
                    <button type="submit">{texts[language].loginButton}</button>
                  </form>
                </div>
                <div className="toggle-container">
                  <div className="toggle">
                    <div className="toggle-panel toggle-left">
                      <h1>{texts[language].welcomeBack}</h1>
                      <p>{texts[language].connectWithPersonalDetails}</p>
                      <button
                        className="hidden"
                        id="login"
                        onClick={() => setIsRegister(false)}
                      >
                        {texts[language].loginButton}
                      </button>
                    </div>
                    <div className="toggle-panel toggle-right">
                      <h1>{texts[language].helloFriend}</h1>
                      <p>{texts[language].enterPersonalDetails}</p>
                      <button
                        className="hidden"
                        id="register"
                        onClick={() => setIsRegister(true)}
                      >
                        {texts[language].registerButton}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;