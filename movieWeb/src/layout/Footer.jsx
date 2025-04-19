import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faYoutube, faTiktok, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "../pages/LanguageContext"; // Import context
import translations from "../pages/translations";
import "../styles/Footer.css";

const Footer = ({ toggleDarkMode, darkMode }) => {
  const { language, toggleLanguage } = useLanguage(); // Get language and toggle function from context

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section left">
          <h3>{translations[language].cinemas}</h3>
          <ul>
            {translations[language].cinemasList.map((cinema, index) => (
              <li key={index}>
                {cinema.name} - Hotline: {cinema.hotline}
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-section center">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <p>© 2021 Cinema Media. All Rights Reserved</p>
          <button className="toggle-button" onClick={toggleDarkMode}>
            {darkMode ? translations[language].lightMode : translations[language].darkMode}
          </button>
        </div>
        <div className="footer-section right">
          <h3>{translations[language].connectWithUs}</h3>
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
          <h3>{translations[language].contact}</h3>
          <p>{translations[language].company}</p>
          <p>{translations[language].address}</p>
          <p>{translations[language].hotline}</p>
          <p>{translations[language].email}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;