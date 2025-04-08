import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/Header.css";

import {
  faUser,
  faDiamond,
  faPlaneDeparture,
  faMapMarkerAlt,
  faGift,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import vietnamFlag from "../assets/poster/Vietnam.jpg";
import englandFlag from "../assets/poster/england-flag.png";
import { useLanguage } from "../pages/LanguageContext"; // Import context

const Header = ({ user, handleLogout, searchTerm, handleSearchChange }) => {
  const { language, toggleLanguage } = useLanguage(); // Lấy ngôn ngữ từ context
  const [showDropdown, setShowDropdown] = useState(false); // Trạng thái hiển thị menu

  const texts = {
    vi: {
      showtimes: "LỊCH CHIẾU THEO RẠP",
      movies: "PHIM",
      theaters: "RẠP",
      ticketPrices: "GIÁ VÉ",
      news: "TIN MỚI VÀ ƯU ĐÃI",
      searchPlaceholder: "Tìm kiếm phim...",
      login: "Đăng nhập",
      logout: "Đăng xuất",
      hello: "Xin chào",
      account: "Thông tin tài khoản",
      memberCard: "Thẻ thành viên",
      movieJourney: "Hành trình điện ảnh",
      Points: "Điểm ",
      myVouchers: "Voucher của tôi",
    },
    en: {
      showtimes: "SHOWTIMES",
      movies: "MOVIES",
      theaters: "THEATERS",
      ticketPrices: "TICKET PRICES",
      news: "NEWS & PROMOTIONS",
      searchPlaceholder: "Search movies...",
      login: "Login",
      logout: "Logout",
      hello: "Hello",
      account: "Account Information",
      memberCard: "Membership Card",
      movieJourney: "Movie Journey",
      Points: " Points",
      myVouchers: "My Vouchers",
    },
  };

  return (
    <header>
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      <nav>
        <ul>
          <li><Link to="/showtimes">{texts[language].showtimes}</Link></li>
          <li><Link to="/movielist">{texts[language].movies}</Link></li>
          <li><Link to="/place">{texts[language].theaters}</Link></li>
          <li><Link to="/about">{texts[language].ticketPrices}</Link></li>
          <li><Link to="/news">{texts[language].news}</Link></li>
        </ul>
      </nav>

      <div className="search-bar">
        <input
          type="text"
          placeholder={texts[language].searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Nút chuyển đổi ngôn ngữ */}
      <button className="language-toggle" onClick={toggleLanguage}>
        <img src={language === "vi" ? englandFlag : vietnamFlag} alt="Language" />
      </button>

      {/* Hiển thị thông tin người dùng */}
      {user ? (
        <div 
          className="user-menu" 
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <button className="user-button">
            {texts[language].hello}, {user.name || "User"} ▼
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/account">
                <FontAwesomeIcon icon={faUser} /> {texts[language].account}
              </Link>
              <Link to="/member-card">
                <FontAwesomeIcon icon={faDiamond} /> {texts[language].memberCard}
              </Link>
              <Link to="/movie-journey">
                <FontAwesomeIcon icon={faPlaneDeparture} /> {texts[language].movieJourney}
              </Link>
              <Link to="/points">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {texts[language].Points}
              </Link>
              <Link to="/vouchers">
                <FontAwesomeIcon icon={faGift} /> {texts[language].myVouchers}
              </Link>
              <button onClick={handleLogout} className="logout-button">
                <FontAwesomeIcon icon={faSignOutAlt} /> {texts[language].logout}
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/login" className="login-button">{texts[language].login}</Link>
      )}
    </header>
  );
};

export default Header;