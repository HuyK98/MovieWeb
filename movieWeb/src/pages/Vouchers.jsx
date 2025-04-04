import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Vouchers.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useLanguage } from "../pages/LanguageContext"; // Import context

const Vouchers = () => {
  const { language } = useLanguage(); // Lấy ngôn ngữ từ context
  const [darkMode, setDarkMode] = useState(false); // Quản lý chế độ tối
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null); // Trạng thái người dùng
  const navigate = useNavigate();

  const texts = {
    vi: {
      vouchersTitle: "VOUCHER CỦA TÔI",
      voucherCode: "Mã voucher",
      voucherContent: "Nội dung voucher",
      voucherType: "Loại voucher",
      expiryDate: "Ngày hết hạn",
      actions: "Thao tác",
      historyTitle: "LỊCH SỬ VOUCHER",
      date: "Thời gian",
      voucherCodeHistory: "Mã voucher",
      voucherContentHistory: "Nội dung voucher",
      status: "Trạng thái",
      noData: "Chưa có dữ liệu",
      discount10: "Giảm 10% cho lần mua tiếp theo",
      discount5: "Giảm 5% cho tất cả sản phẩm",
      freePopcorn: "Miễn phí 1 bắp và 1 nước",
      discount: "Giảm giá",
      gift: "Quà tặng",
      used: "Đã sử dụng",
      notUsed: "Chưa sử dụng",
    },
    en: {
      vouchersTitle: "MY VOUCHERS",
      voucherCode: "Voucher Code",
      voucherContent: "Voucher Content",
      voucherType: "Voucher Type",
      expiryDate: "Expiry Date",
      actions: "Actions",
      historyTitle: "VOUCHER HISTORY",
      date: "Date",
      voucherCodeHistory: "Voucher Code",
      voucherContentHistory: "Voucher Content",
      status: "Status",
      noData: "No data available",
      discount10: "10% off for your next purchase",
      discount5: "5% off all products",
      freePopcorn: "Free popcorn and a drink",
      discount: "Discount",
      gift: "Gift",
      used: "Used",
      notUsed: "Not used",
    },
  };
  

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
          <h2>{texts[language].vouchersTitle}</h2>
          <div className="vouchers-list">
            <table className="vouchers-table">
              <thead>
                <tr>
                  <th>{texts[language].voucherCode}</th>
                  <th>{texts[language].voucherContent}</th>
                  <th>{texts[language].voucherType}</th>
                  <th>{texts[language].expiryDate}</th>
                  <th>{texts[language].actions}</th>
                </tr>
              </thead>
              <tbody>
                {/* Các voucher mẫu */}
                <tr>
                  <td>ABC123</td>
                  <td>{texts[language].discount10}</td> {/* Cập nhật theo ngôn ngữ */}
                  <td>{texts[language].discount}</td>
                  <td>31/12/2025</td>
                  <td><button className="redeem-button">{texts[language].actions}</button></td>
                </tr>
                <tr>
                  <td>XYZ456</td>
                  <td>{texts[language].freePopcorn}</td> {/* Cập nhật theo ngôn ngữ */}
                  <td>{texts[language].gift}</td>
                  <td>15/06/2025</td>
                  <td><button className="redeem-button">{texts[language].actions}</button></td>
                </tr>
                <tr>
                  <td>DEF789</td>
                  <td>{texts[language].discount5}</td> {/* Cập nhật theo ngôn ngữ */}
                  <td>{texts[language].discount}</td>
                  <td>30/09/2025</td>
                  <td><button className="redeem-button">{texts[language].actions}</button></td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <h3>{texts[language].historyTitle}</h3>
          <table className="voucher-history">
            <thead>
              <tr>
                <th>{texts[language].date}</th>
                <th>{texts[language].voucherCodeHistory}</th>
                <th>{texts[language].voucherContentHistory}</th>
                <th>{texts[language].status}</th>
              </tr>
            </thead>
            <tbody>
              {/* Lịch sử voucher mẫu */}
              <tr>
                <td>01/04/2025</td>
                <td>ABC123</td>
                <td>{texts[language].discount10}</td> {/* Cập nhật theo ngôn ngữ */}
                <td>{texts[language].used}</td>
              </tr>
              <tr>
                <td>15/03/2025</td>
                <td>XYZ456</td>
                <td>{texts[language].freePopcorn}</td> {/* Cập nhật theo ngôn ngữ */}
                <td>{texts[language].notUsed}</td>
              </tr>
              <tr>
                <td>10/02/2025</td>
                <td>DEF789</td>
                <td>{texts[language].discount5}</td> {/* Cập nhật theo ngôn ngữ */}
                <td>{texts[language].used}</td>
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
