import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/PriceList.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "../pages/LanguageContext";

const PriceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [setIsScrolled] = useState(false);
  const { language } = useLanguage();

  const texts = {
    vi: {
      ticketPrices: "GIÁ VÉ RẠP CINEMA GÒ VẤP",
      like: "❤️ {count} người thích",
      likeBtn: "👍 Thích",
      shareBtn: "Chia Sẻ",
      price2D: "BẢNG GIÁ VÉ 2D - GÒ VẤP",
      price3D: "BẢNG GIÁ VÉ 3D - GÒ VẤP",
      note1: "* Phù hợp +5.000 VND với ghế VIP & ghế đôi, trừ Mad Sale Days",
      note2: "* Phù hợp +10.000 VND với ghế VIP ngoài khung giờ khuyến mãi",
      note3: "* Vé HS-SV: Dùng thẻ học sinh/sinh viên có dán ảnh, không áp dụng ngày lễ",
      note4: "* Vé trẻ em: Dưới 1m3 theo quy định",
    },
    en: {
      ticketPrices: "TICKET PRICES - GÒ VẤP CINEMA",
      like: "❤️ {count} likes",
      likeBtn: "👍 Like",
      shareBtn: "Share",
      price2D: "2D TICKET PRICES - GÒ VẤP",
      price3D: "3D TICKET PRICES - GÒ VẤP",
      note1: "* Additional 5,000 VND for VIP & couple seats, except Mad Sale Days",
      note2: "* Additional 10,000 VND for VIP seats outside the promotion time",
      note3: "* Student tickets: Use student ID with a photo, not applicable on public holidays",
      note4: "* Child ticket: Under 1m3 as per regulations",
    },
  };

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
            <h1>{texts[language].ticketPrices}</h1>
            <div className="social-share">
              <span>{texts[language].like.replace("{count}", 3)}</span>
              <button className="like-btn">{texts[language].likeBtn}</button>
              <button className="share-btn">{texts[language].shareBtn}</button>
            </div>
          </div>

          {/* Giá vé 2D */}
          <div className="price-section">
            <h2 className="price-title">{texts[language].price2D}</h2>
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
              <p>{texts[language].note1}</p>
              <p>{texts[language].note2}</p>
              <p>{texts[language].note3}</p>
              <p>{texts[language].note4}</p>
            </div>
          </div>

          {/* Giá vé 3D */}
          <div className="price-section">
            <h2 className="price-title">{texts[language].price3D}</h2>
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
              <p>{texts[language].note1}</p>
              <p>{texts[language].note2}</p>
              <p>{texts[language].note3}</p>
              <p>{texts[language].note4}</p>
            </div>
          </div>
        </main>
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default PriceList;
