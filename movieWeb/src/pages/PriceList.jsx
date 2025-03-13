import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/PriceList.css"; // File CSS riêng cho phần nội dung đặc thù
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faYoutube, faTiktok, faInstagram } from "@fortawesome/free-brands-svg-icons";

const PriceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

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

      {/* Nội dung chính của PriceList */}
      <main className="price-main">
        <div className="price-banner">
          <h1>GIÁ VÉ RẠP CINEMA GÒ VẤP</h1>
          <div className="social-share">
            <span>❤️ {3} người thích</span>
            <button className="like-btn">👍 Thích</button>
            <button className="share-btn">Chia Sẻ</button>
          </div>
        </div>

        {/* Giá vé 2D */}
        <div className="price-section">
          <h2 className="price-title">BẢNG GIÁ VÉ 2D - GÒ VẤP</h2>
          <div className="price-table">
            <div className="price-row header-row">
              <div className="price-cell">LOẠI VÉ</div>
              <div className="price-cell">10h - 18h</div>
              <div className="price-cell">18h - 22h</div>
            </div>
            <div className="price-row">
              <div className="price-cell">MAD SALE DAYS</div>
              <div className="price-cell">40.000</div>
              <div className="price-cell">40.000</div>
            </div>
            <div className="price-row">
              <div className="price-cell">BETA TEN (Thứ 2)</div>
              <div className="price-cell">45.000</div>
              <div className="price-cell">45.000</div>
            </div>
            <div className="price-row">
              <div className="price-cell">HAPPY DAY - TIẾT KIỆM</div>
              <div className="price-cell">Thứ 2, 4, 5, 6</div>
              <div className="price-cell">60.000</div>
              <div className="price-cell">65.000</div>
            </div>
            <div className="price-row">
              <div className="price-cell">Thứ 7, CN</div>
              <div className="price-cell">60.000</div>
              <div className="price-cell">65.000</div>
            </div>
            <div className="price-row">
              <div className="price-cell">NGÀY LỄ</div>
              <div className="price-cell">80.000</div>
              <div className="price-cell">80.000</div>
            </div>
          </div>
          <div className="price-note">
            <p>* Phù hợp +5.000 VND với ghế VIP & ghế đôi, trừ Mad Sale Days</p>
            <p>* Phù hợp +10.000 VND với ghế VIP ngoài khung giờ khuyến mãi</p>
            <p>* Vé HS-SV: Dùng thẻ học sinh/sinh viên có dán ảnh, không áp dụng ngày lễ</p>
            <p>* Vé trẻ em: Dưới 1m3 theo quy định</p>
          </div>
        </div>

        {/* Giá vé 3D */}
        <div className="price-section">
          <h2 className="price-title">BẢNG GIÁ VÉ 3D - GÒ VẤP</h2>
          <div className="price-table">
            <div className="price-row header-row">
              <div className="price-cell">LOẠI VÉ</div>
              <div className="price-cell">10h - 18h</div>
              <div className="price-cell">18h - 22h</div>
            </div>
            <div className="price-row">
              <div className="price-cell">MAD SALE DAYS</div>
              <div className="price-cell">50.000</div>
              <div className="price-cell">50.000</div>
            </div>
            <div className="price-row">
              <div className="price-cell">BETA TEN (Thứ 2)</div>
              <div className="price-cell">55.000</div>
              <div className="price-cell">55.000</div>
            </div>
            <div className="price-row">
              <div className="price-cell">HAPPY DAY - TIẾT KIỆM</div>
              <div className="price-cell">Thứ 2, 4, 5, 6</div>
              <div className="price-cell">70.000</div>
              <div className="price-cell">75.000</div>
            </div>
            <div className="price-row">
              <div className="price-cell">Thứ 7, CN</div>
              <div className="price-cell">70.000</div>
              <div className="price-cell">75.000</div>
            </div>
            <div className="price-row">
              <div className="price-cell">NGÀY LỄ</div>
              <div className="price-cell">90.000</div>
              <div className="price-cell">90.000</div>
            </div>
          </div>
          <div className="price-note">
            <p>* Phù hợp +5.000 VND với ghế VIP & ghế đôi, trừ Mad Sale Days</p>
            <p>* Phù hợp +10.000 VND với ghế VIP ngoài khung giờ khuyến mãi</p>
            <p>* Vé HS-SV: Dùng thẻ học sinh/sinh viên có dán ảnh, không áp dụng ngày lễ</p>
            <p>* Vé trẻ em: Dưới 1m3 theo quy định</p>
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

export default PriceList;