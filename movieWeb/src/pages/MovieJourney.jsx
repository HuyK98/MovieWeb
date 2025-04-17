import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/MovieJourney.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "../pages/LanguageContext";
import translations from "../pages/translations";

const MovieJourney = () => {
  const { language } = useLanguage();
  const [user, setUser] = useState({
    name: "",
    movieHistory: [],
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
        <div className="movie-journey-container">
          {/* Removed the tab navigation */}
          <h2>{translations[language].journeyTitle}</h2>
          <table className="movie-journey-history">
            <thead>
              <tr>
                <th className="table-header">
                  {translations[language].movieCode}
                </th>
                <th className="table-header">{translations[language].movie}</th>
                <th className="table-header">
                  {translations[language].theater}
                </th>
                <th className="table-header">
                  {translations[language].showtime}
                </th>
                <th className="table-header">{translations[language].seat}</th>
                <th className="table-header">{translations[language].combo}</th>
                <th className="table-header">
                  {translations[language].bookingDate}
                </th>
                <th className="table-header">
                  {translations[language].points}
                </th>
              </tr>
            </thead>
            <tbody>
              {user.movieHistory && user.movieHistory.length > 0 ? (
                user.movieHistory.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.movieCode}</td>
                    <td>{entry.movie}</td>
                    <td>{entry.theater}</td>
                    <td>{entry.showtime}</td>
                    <td>{entry.seat}</td>
                    <td>{entry.combo}</td>
                    <td>{entry.bookingDate}</td>
                    <td>
                      {entry.points} {translations[language].points}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">{translations[language].noData}</td>
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

export default MovieJourney;