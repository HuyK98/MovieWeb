import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Points.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "./LanguageContext";
import translations from "../pages/translations";

const Points = () => {
  const { language } = useLanguage();
  const [user, setUser] = useState({
    name: "",
    pointsAccumulated: 0, // Điểm đã tích lũy
    pointsUsed: 0, // Điểm đã sử dụng
    currentPoints: 0, // Điểm hiện có
    expiringPoints: 0, // Điểm sắp hết hạn
    history: [] // Lịch sử điểm
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className={`home-container ${darkMode ? "dark-mode" : ""}`}>
      <Header user={user} isScrolled={isScrolled} />
      <main>
        <div className="points-container">
          <h2>{translations[language].pointsTitle}</h2>
          <div className="points-summary">
            <p>{translations[language].pointsAccumulated}: <strong>{user.pointsAccumulated} {translations[language].points}</strong></p>
            <p>{translations[language].pointsUsed}: <strong>{user.pointsUsed} {translations[language].points}</strong></p>
            <p>{translations[language].currentPoints}: <strong>{user.currentPoints} {translations[language].points}</strong></p>
            <p>{translations[language].expiringPoints}: <strong>{user.expiringPoints} {translations[language].points}</strong></p>
          </div>
          <h3>{translations[language].historyTitle}</h3>
          <table className="points-history">
            <thead>
              <tr>
                <th className="table-header">{translations[language].date}</th>
                <th className="table-header">{translations[language].points}</th>
                <th className="table-header">{translations[language].description}</th>
              </tr>
            </thead>
            <tbody>
              {user.history && user.history.length > 0 ? (
                user.history.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.date}</td>
                    <td>{entry.points} {translations[language].points}</td>
                    <td>{entry.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">{translations[language].noData}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </div>
  );
};

export default Points;
