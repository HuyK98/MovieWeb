import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/PaymentInfo.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import momoIcon from "../assets/momo.ico";
import moment from "moment";
import translations from "../pages/translations";
import { useLanguage } from "../pages/LanguageContext"; // Import context

const PaymentInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingInfo, selectedSeats, totalPrice } = location.state || {};
  const [user, setUser] = useState({ name: "", phone: "", email: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, toggleLanguage } = useLanguage(); // Lấy ngôn ngữ từ context

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  useEffect(() => {
    // Lấy thông tin người dùng từ endpoint
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo")).token
          : null; // Lấy token từ localStorage
        if (!token) {
          throw new Error("No token found");
        }
        const response = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        if (error.response) {
          // Request made and server responded
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          // Request made but no response received
          console.error("Request data:", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Error message:", error.message);
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null; // Lấy token từ localStorage
      if (!token) {
        throw new Error("No token found");
      }

      // Kiểm tra nếu người dùng chưa chọn phương thức thanh toán
      if (!paymentMethod) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
      }

      let bookingData = {
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        movie: {
          title: bookingInfo.movieTitle,
          imageUrl: bookingInfo.imageUrl,
          releaseDate: bookingInfo.releaseDate,
          genre: bookingInfo.genre,
        },
        booking: {
          date: bookingInfo.date,
          seats: selectedSeats,
          totalPrice: totalPrice,
          paymentMethod: paymentMethod,
        },
      };

      if (paymentMethod === "momo") {
        // Xử lý thanh toán qua ví MoMo
        const momoResponse = await axios.post(
          "http://localhost:5000/api/payment/momo",
          {
            bookingInfo,
            selectedSeats,
            totalPrice,
            paymentMethod,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (momoResponse.data && momoResponse.data.payUrl) {
          // Lưu thông tin vé vào localStorage
          const storedBookings =
            JSON.parse(localStorage.getItem("bookings")) || [];
          localStorage.setItem(
            "bookings",
            JSON.stringify([...storedBookings, bookingData])
          );
          window.location.href = momoResponse.data.payUrl; // Redirect to MoMo payment page
          return;
        } else {
          throw new Error("MoMo payment failed");
        }
      } else {
        // Xử lý thanh toán thông thường
        const response = await axios.post(
          "http://localhost:5000/api/payment/pay",
          {
            bookingInfo,
            selectedSeats,
            totalPrice,
            paymentMethod,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Lưu thông tin vé vào localStorage
        const storedBookings =
          JSON.parse(localStorage.getItem("bookings")) || [];
        localStorage.setItem(
          "bookings",
          JSON.stringify([...storedBookings, bookingData])
        );
        alert("Thanh toán thành công!");
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  //scroll header
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
    <div>
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        isScrolled={isScrolled}
      />
      <div className="home-content">
        <div className="payment-movie-container">
          <div className="payment-info-container">
            <h2>{translations[language].paymentInfoTitle}</h2>
            <div className="payment-details">
              <div className="form-group">
                <label>
                  {translations[language].fullNameLabel}: {user.name}
                </label>
              </div>
              <div className="form-group">
                <label>
                  {translations[language].phoneLabel}: {user.phone}
                </label>
              </div>
              <div className="form-group">
                <label>
                  {translations[language].emailLabel}: {user.email}
                </label>
              </div>
              <div className="form-group">
                <p>
                  <strong>{translations[language].seatsLabel}:</strong>{" "}
                  {selectedSeats.join(", ")}
                </p>

                <p>
                  <strong>{translations[language].totalPriceLabel}:</strong>{" "}
                  {totalPrice.toLocaleString()} {translations[language].vnd}
                </p>
              </div>
              <div className="form-group">
                <label>{translations[language].paymentMethodLabel}:</label>
                <div className="payment-methods">
                  <label>
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    {translations[language].cashOption}
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="momo"
                      checked={paymentMethod === "momo"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <img className="momo-icon" src={momoIcon} alt="MOMO" />
                    {translations[language].momoOption}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="movie-info">
            <h2>{translations[language].movieInfoTitle}</h2>
            <img src={bookingInfo.imageUrl} alt={bookingInfo.movieTitle} />
            <div className="details">
              <p>
                <strong>{translations[language].movieTitleLabel}:</strong>{" "}
                {bookingInfo.movieTitle}
              </p>
              <p>
                <strong>{translations[language].genreLabel}:</strong>{" "}
                {bookingInfo.genre}
              </p>
              <p>
                <strong>{translations[language].durationLabel}:</strong>{" "}
                {bookingInfo.description}
              </p>
              <p>
                <strong>{translations[language].cinemaLabel}:</strong>{" "}
                {bookingInfo.cinema}
              </p>
              <p>
                <strong>{translations[language].showDateLabel}:</strong>{" "}
                {moment(bookingInfo.date).format("DD/MM/YYYY")}
              </p>
              <p>
                <strong>{translations[language].showTimeLabel}:</strong>{" "}
                {bookingInfo.time}
              </p>
            </div>
            <div className="button-container">
              <button className="booking-btn" onClick={() => navigate(-1)}>
                {translations[language].backButton}
              </button>
              <button className="booking-btn" onClick={handlePayment}>
                {translations[language].payButton}
              </button>
            </div>
          </div>
        </div>
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default PaymentInfo;
