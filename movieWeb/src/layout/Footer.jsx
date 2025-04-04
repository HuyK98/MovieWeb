import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faYoutube, faTiktok, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "../pages/LanguageContext"; // Import context

const Footer = ({ toggleDarkMode, darkMode }) => {
  const { language, toggleLanguage } = useLanguage(); // Get language and toggle function from context

  const texts = {
    vi: {
      cinemas: "CÁC RẠP Cinema",
      connectWithUs: "KẾT NỐI VỚI CHÚNG TÔI",
      contact: "LIÊN HỆ",
      company: "CÔNG TY CỔ PHẦN CINEMA MEDIA",
      address: "Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
      hotline: "Hotline: 1800 123 456",
      email: "Email: info@cinemamedia.vn",
      lightMode: "Chế độ sáng",
      darkMode: "Chế độ tối",
      cinemasList: [
        { name: "Cinema Xuân Thủy, Hà Nội", hotline: "033 023 183" },
        { name: "Cinema Tây Sơn, Hà Nội", hotline: "097 694 713" },
        { name: "Cinema Nguyễn Trãi, TP. Hồ Chí Minh", hotline: "070 675 509" },
        { name: "Cinema Quang Trung, TP. Hồ Chí Minh", hotline: "090 123 456" },
        { name: "Cinema Đống Đa, Hà Nội", hotline: "098 765 432" },
        { name: "Cinema Cầu Giấy, Hà Nội", hotline: "098 765 432" },
      ],
    },
    en: {
      cinemas: "CINEMAS",
      connectWithUs: "CONNECT WITH US",
      contact: "CONTACT",
      company: "CINEMA MEDIA JOINT STOCK COMPANY",
      address: "Address: 123 ABC Street, District 1, Ho Chi Minh City",
      hotline: "Hotline: 1800 123 456",
      email: "Email: info@cinemamedia.vn",
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      cinemasList: [
        { name: "Cinema Xuan Thuy, Hanoi", hotline: "033 023 183" },
        { name: "Cinema Tay Son, Hanoi", hotline: "097 694 713" },
        { name: "Cinema Nguyen Trai, Ho Chi Minh City", hotline: "070 675 509" },
        { name: "Cinema Quang Trung, Ho Chi Minh City", hotline: "090 123 456" },
        { name: "Cinema Dong Da, Hanoi", hotline: "098 765 432" },
        { name: "Cinema Cau Giay, Hanoi", hotline: "098 765 432" },
      ],
    },
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section left">
          <h3>{texts[language].cinemas}</h3>
          <ul>
            {texts[language].cinemasList.map((cinema, index) => (
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
            {darkMode ? texts[language].lightMode : texts[language].darkMode}
          </button>
        </div>
        <div className="footer-section right">
          <h3>{texts[language].connectWithUs}</h3>
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
          <h3>{texts[language].contact}</h3>
          <p>{texts[language].company}</p>
          <p>{texts[language].address}</p>
          <p>{texts[language].hotline}</p>
          <p>{texts[language].email}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
