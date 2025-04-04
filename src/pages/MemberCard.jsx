import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/MemberCard.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "../pages/LanguageContext";

const MemberCard = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [memberCard, setMemberCard] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [error, setError] = useState(null);

  const texts = {
    vi: {
      memberCard: "THẺ THÀNH VIÊN",
      cardNumber: "SỐ THẺ",
      rank: "HẠNG THẺ",
      totalSpent: "TỔNG CHI TIÊU",
      accumulatedPoints: "ĐIỂM TÍCH LŨY",
      upgradeMessage: "Bạn cần tích lũy thêm {amount} đ để nâng hạng Khách hàng VIP",
    },
    en: {
      memberCard: "MEMBER CARD",
      cardNumber: "CARD NUMBER",
      rank: "RANK",
      totalSpent: "TOTAL SPENT",
      accumulatedPoints: "ACCUMULATED POINTS",
      upgradeMessage: "You need to accumulate {amount} VND to upgrade to VIP Member",
    },
  };

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
          <h2>{texts[language].memberCard}</h2>
          {error ? (
            <p className="error-message">{error}</p>
          ) : memberCard ? (
            <table>
              <thead>
                <tr>
                  <th>{texts[language].cardNumber}</th>
                  <th>{texts[language].rank}</th>
                  <th>{texts[language].totalSpent}</th>
                  <th>{texts[language].accumulatedPoints}</th>
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
              {texts[language].upgradeMessage.replace(
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