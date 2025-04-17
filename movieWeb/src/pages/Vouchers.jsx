import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Vouchers.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "../pages/LanguageContext"; // Import context
import translations from "../pages/translations";


const Vouchers = () => {
  const { language } = useLanguage(); // Lấy ngôn ngữ từ context
  const [darkMode, setDarkMode] = useState(false); // Quản lý chế độ tối
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null); // Trạng thái người dùng
  const navigate = useNavigate();



  useEffect(() => {
    // Kiểm tra dữ liệu người dùng từ localStorage
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const parsedUserInfo = JSON.parse(userInfo);
        setUser(parsedUserInfo); // Cập nhật trạng thái người dùng
      } catch (error) {
        console.error("Lỗi khi đọc dữ liệu người dùng từ localStorage:", error);
      }
    } else {
      // Nếu không có dữ liệu, điều hướng người dùng về trang đăng nhập
      navigate("/login");
    }
  }, [navigate]);

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
      <Header user={user} isScrolled={isScrolled} /> {/* Truyền user vào Header */}
      <main>
        <div className="vouchers-container">
          <h2>{translations[language].vouchersTitle}</h2>
          <div className="vouchers-list">
            <table className="vouchers-table">
              <thead>
                <tr>
                  <th>{translations[language].voucherCode}</th>
                  <th>{translations[language].voucherContent}</th>
                  <th>{translations[language].voucherType}</th>
                  <th>{translations[language].expiryDate}</th>
                  <th>{translations[language].actions}</th>
                </tr>
              </thead>
              <tbody>
                {/* Các voucher mẫu */}
                <tr>
                  <td>ABC123</td>
                  <td>{translations[language].discount10}</td> {/* Cập nhật theo ngôn ngữ */}
                  <td>{translations[language].discount}</td>
                  <td>31/12/2025</td>
                  <td><button className="redeem-button">{translations[language].actions}</button></td>
                </tr>
                <tr>
                  <td>XYZ456</td>
                  <td>{translations[language].freePopcorn}</td> {/* Cập nhật theo ngôn ngữ */}
                  <td>{translations[language].gift}</td>
                  <td>15/06/2025</td>
                  <td><button className="redeem-button">{translations[language].actions}</button></td>
                </tr>
                <tr>
                  <td>DEF789</td>
                  <td>{translations[language].discount5}</td> {/* Cập nhật theo ngôn ngữ */}
                  <td>{translations[language].discount}</td>
                  <td>30/09/2025</td>
                  <td><button className="redeem-button">{translations[language].actions}</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>{translations[language].historyTitle}</h3>
          <table className="voucher-history">
            <thead>
              <tr>
                <th>{translations[language].date}</th>
                <th>{translations[language].voucherCodeHistory}</th>
                <th>{translations[language].voucherContentHistory}</th>
                <th>{translations[language].status}</th>
              </tr>
            </thead>
            <tbody>
              {/* Lịch sử voucher mẫu */}
              <tr>
                <td>01/04/2025</td>
                <td>ABC123</td>
                <td>{translations[language].discount10}</td> {/* Cập nhật theo ngôn ngữ */}
                <td>{translations[language].used}</td>
              </tr>
              <tr>
                <td>15/03/2025</td>
                <td>XYZ456</td>
                <td>{translations[language].freePopcorn}</td> {/* Cập nhật theo ngôn ngữ */}
                <td>{translations[language].notUsed}</td>
              </tr>
              <tr>
                <td>10/02/2025</td>
                <td>DEF789</td>
                <td>{translations[language].discount5}</td> {/* Cập nhật theo ngôn ngữ */}
                <td>{translations[language].used}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </div>
  );

};

export default Vouchers;