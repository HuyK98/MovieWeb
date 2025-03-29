import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const Header = ({ 
  user, 
  handleLogout, 
  searchTerm, 
  handleSearchChange, 
  favorites = [], 
  toggleFavorites 
}) => {
  return (
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
          {user ? (
            <>
              <li><span>Xin chào, {user.name}</span></li>
              <li><button onClick={handleLogout}>Đăng xuất</button></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </nav>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm phim..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
      <div className="favorites-icon" onClick={toggleFavorites}>
        <FontAwesomeIcon icon={faBell} />
        {favorites.length > 0 && <span className="favorites-count">{favorites.length}</span>}
      </div>
    </header>
  );
};

export default Header;