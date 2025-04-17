import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/PriceList.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import translations from "../pages/translations";
import { useLanguage } from "../pages/LanguageContext";

const PriceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language } = useLanguage();


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
        isScrolled={isScrolled}
      />

      {/* Nội dung chính của PriceList */}
      <div className="home-content">
        <main className="price-main">
          <div className="price-banner">
            <h1>{translations[language].ticketPrices}</h1>
            <div className="social-share">
              <span>{translations[language].like.replace("{count}", 3)}</span>
              <button className="like-btn">
                {translations[language].likeBtn}
              </button>
              <button className="share-btn">
                {translations[language].shareBtn}
              </button>
            </div>
          </div>

          {/* Giá vé 2D */}
          <div className="price-section">
            <h2 className="price-title">{translations[language].price2D}</h2>
            <div className="price-table">
              <div className="price-row header-row">
                <div className="price-cell">
                  {translations[language].ticketType}
                </div>
                <div className="price-cell">10h - 18h</div>
                <div className="price-cell">18h - 22h</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].madSaleDays}
                </div>
                <div className="price-cell">40.000</div>
                <div className="price-cell">40.000</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].betaTen}
                </div>
                <div className="price-cell">45.000</div>
                <div className="price-cell">45.000</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].happyDay}
                </div>
                <div className="price-cell">
                  {translations[language].daysOfWeek["Thứ 2, 4, 5, 6"]}
                </div>
                <div className="price-cell">60.000</div>
                <div className="price-cell">65.000</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].daysOfWeek["Thứ 7"]},{" "}
                  {translations[language].daysOfWeek["CN"]}
                </div>
                <div className="price-cell">60.000</div>
                <div className="price-cell">65.000</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].publicHoliday}
                </div>
                <div className="price-cell">80.000</div>
                <div className="price-cell">80.000</div>
              </div>
            </div>
            <div className="price-note">
              <p>{translations[language].note1}</p>
              <p>{translations[language].note2}</p>
              <p>{translations[language].note3}</p>
              <p>{translations[language].note4}</p>
            </div>
          </div>

          {/* Giá vé 3D */}
          <div className="price-section">
            <h2 className="price-title">{translations[language].price3D}</h2>
            <div className="price-table">
              <div className="price-row header-row">
                <div className="price-cell">
                  {translations[language].ticketType}
                </div>
                <div className="price-cell">10h - 18h</div>
                <div className="price-cell">18h - 22h</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].madSaleDays}
                </div>
                <div className="price-cell">50.000</div>
                <div className="price-cell">50.000</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].betaTen}
                </div>
                <div className="price-cell">55.000</div>
                <div className="price-cell">55.000</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].happyDay}
                </div>
                <div className="price-cell">
                  {translations[language].daysOfWeek["Thứ 2, 4, 5, 6"]}
                </div>
                <div className="price-cell">70.000</div>
                <div className="price-cell">75.000</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].daysOfWeek["Thứ 7"]},{" "}
                  {translations[language].daysOfWeek["CN"]}
                </div>
                <div className="price-cell">70.000</div>
                <div className="price-cell">75.000</div>
              </div>
              <div className="price-row">
                <div className="price-cell">
                  {translations[language].publicHoliday}
                </div>
                <div className="price-cell">90.000</div>
                <div className="price-cell">90.000</div>
              </div>
            </div>
            <div className="price-note">
              <p>{translations[language].note1}</p>
              <p>{translations[language].note2}</p>
              <p>{translations[language].note3}</p>
              <p>{translations[language].note4}</p>
            </div>
          </div>
        </main>
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default PriceList;