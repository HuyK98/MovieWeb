import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faYoutube, faTiktok, faInstagram } from "@fortawesome/free-brands-svg-icons";
import "../styles/Footer.css";

const Footer = ({ toggleDarkMode, darkMode }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section left">
          <h3>CÁC RẠP Cinema</h3>
          <ul>
            <li>Cinema Xuân Thủy, Hà Nội - Hotline: 033 023 183</li>
            <li>Cinema Tây Sơn, Hà Nội - Hotline: 097 694 713</li>
            <li>Cinema Nguyễn Trãi, TP. Hồ Chí Minh - Hotline: 070 675 509</li>
            <li>Cinema Quang Trung, TP. Hồ Chí Minh - Hotline: 090 123 456</li>
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
            {darkMode ? "Light Mode" : "Dark Mode"}
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
  );
};

export default Footer;