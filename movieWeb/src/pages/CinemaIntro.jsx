
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/CinemaIntro.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone, faGift } from "@fortawesome/free-solid-svg-icons";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import cinemaImage1 from "../assets/cinema.jpeg";
import cinemaImage2 from "../assets/cinema1.jpeg";
import cinemaImage3 from "../assets/cinema2.jpg";
import { useLanguage } from "../pages/LanguageContext"; // Import context
import translations from "../pages/translations";

const CinemaIntro = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, toggleLanguage } = useLanguage(); // Lấy ngôn ngữ từ context


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const slides = [
    { id: 1, image: cinemaImage1, caption: "Trải nghiệm xem phim đỉnh cao" },
    { id: 2, image: cinemaImage2, caption: "Phòng chiếu hiện đại" },
    { id: 3, image: cinemaImage3, caption: "Ghế ngồi thoải mái" },
  ];

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        isScrolled={isScrolled}
      />
      {/* Nội dung chính của CinemaIntro */}
      <div className="home-content">
        <main className="cinema-main">
          <div className="cinema-intro-section fade-in">
            <div className="slider-container">
              <div className="slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide) => (
                  <div key={slide.id} className="slide">
                    <img src={slide.image} alt={`Slide ${slide.id}`} className="slide-image" />
                    <div className="slide-caption">{slide.caption}</div>
                  </div>
                ))}
              </div>
              <div className="slider-dots">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${currentSlide === index ? "active" : ""}`}
                    onClick={() => setCurrentSlide(index)}
                  ></span>
                ))}
              </div>
            </div>
            <div className="right-section fade-in">
              <div className="contact-card">
                <h3>{translations[language].cinemaName}</h3>
                <div className="contact-item">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                  <p><strong>Địa chỉ:</strong> {translations[language].address}</p>
                </div>
                <div className="contact-item">
                  <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                  <p><strong>Hotline:</strong> {translations[language].hotline}</p>
                </div>
                <div className="contact-item">
                  <FontAwesomeIcon icon={faGift} className="contact-icon" />
                  <p><strong>{translations[language].specialServices}</strong></p>
                </div>
                <div className="contact-note">
                  <p><em>{translations[language].promotion}</em></p>
                </div>
                <Link to="/contact" className="contact-button">
                  {translations[language].contactNow}
                </Link>
              </div>
            </div>
          </div>
          <div className="map-section fade-in">
          <h2>{translations[language].location}</h2>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62698.35808816879!2d106.59534874863282!3d10.838273999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529abdd70ce51%3A0xfddf3fab60a9090d!2zTG90dGUgQ2luZW1hIEfDsiVW4bqlcA!5e0!3m2!1sen!2s!4v1741254136822!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        </main>
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default CinemaIntro;
