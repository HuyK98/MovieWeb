import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/NewsAndOffers.css"; // File CSS riêng cho phần nội dung đặc thù
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faSearch, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faYoutube, faTiktok, faInstagram } from "@fortawesome/free-brands-svg-icons";
import offer1Image from "../assets/offer1.png";
import offer2Image from "../assets/offer2.png";
import offer3Image from "../assets/offer3.png";
import offer4Image from "../assets/offer4.jpg";
import offer5Image from "../assets/offer5.png";
import offer6Image from "../assets/offer6.jpg";
import offer7Image from "../assets/offer7.png";
import newsImage1 from "../assets/news1.png";
import newsImage2 from "../assets/news2.jpg";

const NewsAndOffers = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const offers = [
    {
      image: offer1Image,
      title: "THÁNG CỦA XINH IU NHẬN NGAY ƯU ĐÃI",
      description: "Combo Xinh Iu 109K Giá Gốc 177K",
    },
    {
      image: offer2Image,
      title: "THẦN DỰC TRỞ LẠI - TẬU NGAY ƯU ĐÃI",
      description: "Combo 99K",
    },
    {
      image: offer3Image,
      title: "ĐẾN CINEMA - XANH SM NHÁ",
      description: "Giảm 20%",
    },
    {
      image: offer4Image,
      title: "MỲ LY THƠM NGON, XEM PHIM THÊM CUỐN",
      description: "Combo Mỳ Ý Thơm Ngon",
    },
    {
      image: offer5Image,
      title: "ĐẬT VÉ LOTTE CINEMA, MOMO LIỀN!",
      description: "Vé 2D Đóng Gói Chỉ Từ 40K",
    },
    {
      image: offer6Image,
      title: "ĐẶN TẶNG 10K CHO CÁC CINE-ER!",
      description: "Ưu Đãi Cực Chất Cùng ShopeePay",
    },
    {
      image: offer7Image,
      title: "CINEMA VÉ RẺ, MOMO MUA LIỀN!",
      description: "Giảm 10.000 Khi Mua Vé Qua Momo",
    },
  ];

  const news = [
    {
      image: newsImage1,
      title: "THÁNG CỦA XINH IU - NHẬN LIỀN ƯU ĐÃI",
      description: "Giá Gốc 177K",
    },
    {
      image: newsImage2,
      title: "ĐẾN BETA - XANH SM NHÁ",
      description: "Ưu Đãi Đặc Biệt - Tậu Ngay",
    },
  ];

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      {/* Header tái sử dụng từ Home.css */}
      <header>
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        <nav>
          <ul>
            <li><Link to="/showtimes">LỊCH CHIẾU THEO RẠP</Link></li>
            <li><Link to="/movielist">PHIM</Link></li>
            <li><Link to="/place">RẠP</Link></li>
            <li><Link to="/about">GIÁ VÉ</Link></li>
            <li><Link to="/news">TIN MỚI VÀ ƯU ĐÃI</Link></li>
            <li><Link to="/login">THÀNH VIÊN</Link></li>
          </ul>
        </nav>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </header>

      {/* Nội dung chính của NewsAndOffers */}
      <main className="news-offers-main">
        <div className="offers-section">
          <h2>KHUYẾN MÃI MỚI</h2>
          <div className="offers-grid">
            {offers.map((offer, index) => (
              <div key={index} className="offer-item" style={{ animation: `fadeIn 0.5s ease-in ${index * 0.1}s` }}>
                <img src={offer.image} alt={offer.title} className="offer-image" />
                <div className="offer-content">
                  <h3>{offer.title}</h3>
                  <p>{offer.description}</p>
                  <button className="cta-button">Xem Chi Tiết</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="news-section">
          <h2>TIN BÊN LỀ</h2>
          <div className="news-grid">
            {news.map((item, index) => (
              <div key={index} className="news-item" style={{ animation: `fadeIn 0.5s ease-in ${index * 0.1}s` }}>
                <img src={item.image} alt={item.title} className="news-image" />
                <div className="news-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button className="cta-button">Xem Thêm</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer tái sử dụng từ Home.css */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section left">
            <h3>CÁC RẠP CINEMA</h3>
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
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              <span>{darkMode ? " Light Mode" : " Dark Mode"}</span>
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
  );
};

export default NewsAndOffers;