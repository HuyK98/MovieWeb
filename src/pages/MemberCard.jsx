import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/MemberCard.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "./LanguageContext";
import translations from "../pages/translations";

const MemberCard = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [memberCard, setMemberCard] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
    } else {
      setUser(userInfo);
      fetchMemberCard(); // Không cần token vì API hiện tại không yêu cầu
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navigate]);

  const fetchMemberCard = async () => {
    const apiUrl = "http://localhost:5000/api/member-card";
    console.log("Making request to:", apiUrl);
    try {
      const response = await axios.get(apiUrl);
      setMemberCard(response.data);
      setError(null);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu thẻ thành viên:", error);
      setError("Không thể tải dữ liệu thẻ thành viên. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="member-card-container">
      <Header user={user} isScrolled={isScrolled} />
      <main>
        <div className="member-card-content">
          <h2>{translations[language].memberCard}</h2>
          {error ? (
            <p className="error-message">{error}</p>
          ) : memberCard ? (
            <table>
              <thead>
                <tr>
                  <th>{translations[language].cardNumber}</th>
                  <th>{translations[language].rank}</th>
                  <th>{translations[language].totalSpent}</th>
                  <th>{translations[language].accumulatedPoints}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{memberCard.cardNumber} (Đang dùng)</td>
                  <td>{memberCard.cardType}</td>
                  <td>{memberCard.totalSpending.toLocaleString()} đ</td>
                  <td>{memberCard.points}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p>Đang tải dữ liệu...</p>
          )}

          {memberCard && (
            <div className="upgrade-message">
              {translations[language].upgradeMessage.replace(
                "{amount}",
                memberCard.requiredSpending.toLocaleString()
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MemberCard;