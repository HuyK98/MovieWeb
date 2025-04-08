import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NewsAndOffers.css";
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
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
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "../pages/LanguageContext";
import translations from "../pages/translations";

const NewsAndOffers = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);
    const { language } = useLanguage();
    const navigate = useNavigate();

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


    const offers = [
        {
            vi: {
                image: offer1Image,
                title: "THÁNG CỦA XINH IU NHẬN NGAY ƯU ĐÃI",
                description: "Combo Xinh Iu 109K Giá Gốc 177K",
            },
            en: {
                image: offer1Image,
                title: "THE MONTH OF CUTE - GET DISCOUNTS NOW",
                description: "Cute Combo 109K Original Price 177K",
            },
        },
        {
            vi: {
                image: offer2Image,
                title: "THẦN DỰC TRỞ LẠI - TẬU NGAY ƯU ĐÃI",
                description: "Combo 99K",
            },
            en: {
                image: offer2Image,
                title: "THE RETURN OF THE GOD - GET DISCOUNTS NOW",
                description: "Combo 99K",
            },
        },
        {
            vi: {
                image: offer3Image,
                title: "ĐẾN CINEMA - XANH SM NHÁ",
                description: "Giảm 20%",
            },
            en: {
                image: offer3Image,
                title: "COME TO CINEMA - GET DISCOUNTS NOW",
                description: "20% OFF",
            },
        },
        {
            vi: {
                image: offer4Image,
                title: "MỲ LY THƠM NGON, XEM PHIM THÊM CUỐN",
                description: "Combo Mỳ Ý Thơm Ngon",
            },
            en: {
                image: offer4Image,
                title: "DELICIOUS NOODLES, MORE MOVIE TIME",
                description: "Delicious Noodles Combo",
            },
        },
        {
            vi: {
                image: offer5Image,
                title: "ĐẶT VÉ LOTTE CINEMA, MOMO LIỀN!",
                description: "Vé 2D Đóng Gói Chỉ Từ 40K",
            },
            en: {
                image: offer5Image,
                title: "BOOK LOTTE CINEMA TICKETS, MOMO NOW!",
                description: "2D Tickets Pack Starting From 40K",
            },
        },
        {
            vi: {
                image: offer6Image,
                title: "ĐẶT TẶNG 10K CHO CÁC CINE-ER!",
                description: "Ưu Đãi Cực Chất Cùng ShopeePay",
            },
            en: {
                image: offer6Image,
                title: "GIFT 10K FOR CINE-ER!",
                description: "Great Offers With ShopeePay",
            },
        },
        {
            vi: {
                image: offer7Image,
                title: "CINEMA VÉ RẺ, MOMO MUA LIỀN!",
                description: "Giảm 10.000 Khi Mua Vé Qua Momo",
            },
            en: {
                image: offer7Image,
                title: "CHEAP CINEMA TICKETS, MOMO BUY NOW!",
                description: "10.000 Discount When Buying Tickets Through Momo",
            },
        },
    ];

    const news = [
        {
            vi: {
                image: newsImage1,
                title: "THÁNG CỦA XINH IU - NHẬN LIỀN ƯU ĐÃI",
                description: "Giá Gốc 177K",
            },
            en: {
                image: newsImage1,
                title: "THE MONTH OF CUTE - GET DISCOUNTS NOW",
                description: "Original Price 177K",
            },
        },
        {
            vi: {
                image: newsImage2,
                title: "ĐẾN BETA - XANH SM NHÁ",
                description: "Ưu Đãi Đặc Biệt - Tậu Ngay",
            },
            en: {
                image: newsImage2,
                title: "COME TO BETA - GET DISCOUNTS NOW",
                description: "Special Offers - Get Now",
            },
        },
    ];

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (storedUser) {
            setUser(storedUser);
        } else {
            setUser(null);
        }
        document.title = translations[language].title;
    }, [language]);

    return (
        <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
            <Header
                user={user}
                handleLogout={handleLogout}
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
            />
            <main className="news-offers-main">
                <div className="offers-section">
                    <h2>{translations[language].newOffers}</h2>
                    <div className="offers-grid">
                        {offers.map((offer, index) => (
                            <div key={index} className="offer-item" style={{ animation: `fadeIn 0.5s ease-in ${index * 0.1}s` }}>
                                <img src={offer[language].image} alt={offer[language].title} className="offer-image" />
                                <div className="offer-content">
                                    <h3>{offer[language].title}</h3>
                                    <p>{offer[language].description}</p>
                                    <button className="cta-button">{translations[language].viewDetails}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="news-section">
                    <h2>{translations[language].sideNews}</h2>
                    <div className="news-grid">
                        {news.map((item, index) => (
                            <div key={index} className="news-item" style={{ animation: `fadeIn 0.5s ease-in ${index * 0.1}s` }}>
                                <img src={item[language].image} alt={item[language].title} className="news-image" />
                                <div className="news-content">
                                    <h3>{item[language].title}</h3>
                                    <p>{item[language].description}</p>
                                    <button className="cta-button">{translations[language].viewMore}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        </div>
    );
};

export default NewsAndOffers;
