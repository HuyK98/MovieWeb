import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../styles/MovieDetail.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import axios from "axios";
import moment from "moment";
import translations from "../pages/translations";
import { useLanguage } from "../pages/LanguageContext"; // Import context


const MovieDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingInfo } = location.state || {};

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, toggleLanguage } = useLanguage(); // Lấy ngôn ngữ từ context


  useEffect(() => {
    const fetchSeats = async () => {
      try {
        if (
          !bookingInfo ||
          !bookingInfo.movieTitle ||
          !bookingInfo.date ||
          !bookingInfo.time
        ) {
          console.error("bookingInfo hoặc các trường cần thiết là undefined");
          return;
        }

        // Kiểm tra và định dạng ngày
        const formattedDate = moment(
          bookingInfo.date,
          moment.ISO_8601,
          true
        ).isValid()
          ? moment(bookingInfo.date).format("YYYY-MM-DD") // Xử lý định dạng ISO
          : moment(bookingInfo.date, "DD/MM/YYYY", true).isValid()
          ? moment(bookingInfo.date, "DD/MM/YYYY").format("YYYY-MM-DD") // Xử lý định dạng DD/MM/YYYY
          : null;

        if (!formattedDate) {
          console.error("Ngày không hợp lệ:", bookingInfo.date);
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/payment/seats",
          {
            params: {
              movieTitle: bookingInfo.movieTitle,
              date: formattedDate,
              time: bookingInfo.time,
            },
          }
        );

        const bookedSeats = response.data;
        const allSeats = Array.from({ length: 70 }, (_, i) => ({
          id: i + 1,
          isBooked: bookedSeats.includes((i + 1).toString()),
        }));
        setSeats(allSeats);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin ghế:", error);
      }
    };

    fetchSeats();

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, [bookingInfo]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    const isSelected = selectedSeats.includes(seat.id);
    const updatedSelectedSeats = isSelected
      ? selectedSeats.filter((id) => id !== seat.id)
      : [...selectedSeats, seat.id];

    setSelectedSeats(updatedSelectedSeats);
    setTotalPrice(updatedSelectedSeats.length * 50000); // 50,000 VND per seat
  };

  const handleBooking = () => {
    // const formattedDate = moment(bookingInfo.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if (!selectedSeats || selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế trước khi tiếp tục!");
      return;
    }
    const updatedBookingInfo = { ...bookingInfo };
    navigate("/payment", {
      state: { bookingInfo: updatedBookingInfo, selectedSeats, totalPrice },
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  //scroll
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
    <div className={`movie-detail-container ${darkMode ? "dark-mode" : ""}`}>
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        isScrolled={isScrolled}
      />
      <div className="home-content">
        <div className="movie-detail-container">
          <div className="content">
            <p className="map-seats">{translations[language].seatingChart}</p>
            <div className="seating-chart">
              <div className="screen">{translations[language].screen}</div>
              <div className="seats">
                {seats.map((seat) => (
                  <div
                    key={seat.id}
                    className={`seat ${
                      seat.isBooked
                        ? "booked"
                        : selectedSeats.includes(seat.id)
                        ? "selected"
                        : "available"
                    }`}
                    onClick={() => handleSeatClick(seat)}
                  >
                    {seat.id}
                  </div>
                ))}
              </div>
            </div>
            <div className="booking-oder">
              <p>
                <strong>{translations[language].seatsLabel}:</strong>{" "}
                {selectedSeats.join(", ")}
              </p>

              <p>
                <strong>{translations[language].totalPriceLabel}:</strong>{" "}
                {totalPrice.toLocaleString()} {translations[language].vnd}
              </p>
            </div>
            <div className="movie-info">
              <h2>{translations[language].movieInfoTitle}</h2>
              {bookingInfo && (
                <>
                  <img
                    src={bookingInfo.imageUrl}
                    alt={bookingInfo.movieTitle}
                  />
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
                </>
              )}
              <div className="button-container">
                <button className="booking-btn" onClick={() => navigate("/")}>
                  {translations[language].backButton}
                </button>
                <button
                  className="booking-btn"
                  type="button"
                  onClick={handleBooking}
                >
                  {translations[language].continueButton}
                </button>
              </div>
            </div>
            <div className="legend">
              <div className="available">
                <span></span> <p>{translations[language].available}</p>
              </div>
              <div className="selected">
                <span></span> <p>{translations[language].selected}</p>
              </div>
              <div className="booked">
                <span></span> <p>{translations[language].booked}</p>
              </div>
            </div>
          </div>
        </div>
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default MovieDetail;
