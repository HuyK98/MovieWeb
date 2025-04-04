import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/MovieJourney.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "../pages/LanguageContext";

const MovieJourney = () => {
  const { language } = useLanguage();
  const [user, setUser] = useState({
    name: "",
    movieHistory: [],
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const texts = {
    vi: {
      journeyTitle: "HÀNH TRÌNH ĐIỆN ẢNH",
      movieCode: "MÃ HÓA ĐƠN",
      movie: "PHIM",
      theater: "RẠP CHIẾU",
      showtime: "SUẤT CHIẾU",
      seat: "GHẾ ĐÃ ĐẶT",
      combo: "COMBO/PACKAGE",
      bookingDate: "NGÀY ĐẶT",
      points: "ĐIỂM",
      noData: "Chưa có dữ liệu",
    },
    en: {
      journeyTitle: "MOVIE JOURNEY",
      movieCode: "TICKET CODE",
      movie: "MOVIE",
      theater: "THEATER",
      showtime: "SHOWTIME",
      seat: "SEAT",
      combo: "COMBO/PACKAGE",
      bookingDate: "BOOKING DATE",
      points: "POINTS",
      noData: "No data available",
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
        <div className="movie-journey-container">
          {/* Removed the tab navigation */}
          <h2>{texts[language].journeyTitle}</h2>
          <table className="movie-journey-history">
            <thead>
              <tr>
                <th className="table-header">{texts[language].movieCode}</th>
                <th className="table-header">{texts[language].movie}</th>
                <th className="table-header">{texts[language].theater}</th>
                <th className="table-header">{texts[language].showtime}</th>
                <th className="table-header">{texts[language].seat}</th>
                <th className="table-header">{texts[language].combo}</th>
                <th className="table-header">{texts[language].bookingDate}</th>
                <th className="table-header">{texts[language].points}</th>
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
                    <td>{entry.points} {texts[language].points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">{texts[language].noData}</td>
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
