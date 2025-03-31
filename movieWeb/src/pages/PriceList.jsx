import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/PriceList.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const PriceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [setIsScrolled] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
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

  // scroll to top when navigating to a new page
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
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        isScrolled={setIsScrolled}
      />

      {/* Nội dung chính của PriceList */}
      <div className="home-content">
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
              <p>
                * Phù hợp +5.000 VND với ghế VIP & ghế đôi, trừ Mad Sale Days
              </p>
              <p>
                * Phù hợp +10.000 VND với ghế VIP ngoài khung giờ khuyến mãi
              </p>
              <p>
                * Vé HS-SV: Dùng thẻ học sinh/sinh viên có dán ảnh, không áp
                dụng ngày lễ
              </p>
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
              <p>
                * Phù hợp +5.000 VND với ghế VIP & ghế đôi, trừ Mad Sale Days
              </p>
              <p>
                * Phù hợp +10.000 VND với ghế VIP ngoài khung giờ khuyến mãi
              </p>
              <p>
                * Vé HS-SV: Dùng thẻ học sinh/sinh viên có dán ảnh, không áp
                dụng ngày lễ
              </p>
              <p>* Vé trẻ em: Dưới 1m3 theo quy định</p>
            </div>
          </div>
        </main>
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default PriceList;
