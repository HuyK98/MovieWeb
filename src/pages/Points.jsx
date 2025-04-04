import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Points.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "../pages/LanguageContext";

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

  const texts = {
    vi: {
      pointsTitle: "TỔNG QUAN",
      pointsAccumulated: "Điểm đã tích lũy",
      pointsUsed: "Điểm đã sử dụng",
      currentPoints: "Điểm hiện có",
      expiringPoints: "Điểm sắp hết hạn",
      historyTitle: "LỊCH SỬ ĐIỂM",
      date: "THỜI GIAN",
      points: "SỐ ĐIỂM",
      description: "NỘI DUNG SỬ DỤNG",
      noData: "Chưa có dữ liệu"
    },
    en: {
      pointsTitle: "OVERVIEW",
      pointsAccumulated: "Accumulated Points",
      pointsUsed: "Used Points",
      currentPoints: "Current Points",
      expiringPoints: "Expiring Points",
      historyTitle: "POINT HISTORY",
      date: "DATE",
      points: "POINTS",
      description: "DESCRIPTION",
      noData: "No data available"
    },
  };

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
          <h2>{texts[language].pointsTitle}</h2>
          <div className="points-summary">
            <p>{texts[language].pointsAccumulated}: <strong>{user.pointsAccumulated} {texts[language].points}</strong></p>
            <p>{texts[language].pointsUsed}: <strong>{user.pointsUsed} {texts[language].points}</strong></p>
            <p>{texts[language].currentPoints}: <strong>{user.currentPoints} {texts[language].points}</strong></p>
            <p>{texts[language].expiringPoints}: <strong>{user.expiringPoints} {texts[language].points}</strong></p>
          </div>
          <h3>{texts[language].historyTitle}</h3>
          <table className="points-history">
            <thead>
              <tr>
                <th className="table-header">{texts[language].date}</th>
                <th className="table-header">{texts[language].points}</th>
                <th className="table-header">{texts[language].description}</th>
              </tr>
            </thead>
            <tbody>
              {user.history && user.history.length > 0 ? (
                user.history.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.date}</td>
                    <td>{entry.points} {texts[language].points}</td>
                    <td>{entry.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">{texts[language].noData}</td>
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
