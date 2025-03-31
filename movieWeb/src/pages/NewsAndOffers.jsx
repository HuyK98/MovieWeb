import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/NewsAndOffers.css";
import offer1Image from "../assets/offer1.png";
import offer2Image from "../assets/offer2.png";
import offer3Image from "../assets/offer3.png";
import offer4Image from "../assets/offer4.jpg";
import offer5Image from "../assets/offer5.png";
import offer6Image from "../assets/offer6.jpg";
import offer7Image from "../assets/offer7.png";
import newsImage1 from "../assets/news1.png";
import newsImage2 from "../assets/news2.jpg";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const NewsAndOffers = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  //scroll header
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
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        isScrolled={isScrolled}
      />
      {/* Nội dung chính của NewsAndOffers */}
      <div className="home-content">
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
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default NewsAndOffers;