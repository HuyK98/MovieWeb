import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../styles/MovieDetail.css';
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import axios from 'axios';
import moment from 'moment';


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

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        if (!bookingInfo || !bookingInfo.movieTitle || !bookingInfo.date || !bookingInfo.time) {
          console.error('bookingInfo hoặc các trường cần thiết là undefined');
          return;
        }
    
        // Kiểm tra và định dạng ngày
        const formattedDate = moment(bookingInfo.date, moment.ISO_8601, true).isValid()
          ? moment(bookingInfo.date).format('YYYY-MM-DD') // Xử lý định dạng ISO
          : moment(bookingInfo.date, 'DD/MM/YYYY', true).isValid()
          ? moment(bookingInfo.date, 'DD/MM/YYYY').format('YYYY-MM-DD') // Xử lý định dạng DD/MM/YYYY
          : null;
    
        if (!formattedDate) {
          console.error('Ngày không hợp lệ:', bookingInfo.date);
          return;
        }
    
        const response = await axios.get('http://localhost:5000/api/payment/seats', {
          params: {
            movieTitle: bookingInfo.movieTitle,
            date: formattedDate,
            time: bookingInfo.time,
          },
        });
    
        const bookedSeats = response.data;
        const allSeats = Array.from({ length: 70 }, (_, i) => ({
          id: i + 1,
          isBooked: bookedSeats.includes((i + 1).toString()),
        }));
        setSeats(allSeats);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin ghế:', error);
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
    const formattedDate = moment(bookingInfo.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    const updatedBookingInfo = { ...bookingInfo, date: formattedDate };
    navigate('/payment', { state: { bookingInfo: updatedBookingInfo, selectedSeats, totalPrice } });
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

  return (
    <div className={`movie-detail-container ${darkMode ? "dark-mode" : ""}`}> 
            <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <div className="movie-detail-container">
        <div className="content">
          <p className="map-seats">SƠ ĐỒ GHẾ NGỒI</p>
          <div className="seating-chart">
            <div className="screen">Màn hình chiếu</div>
            <div className="seats">
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`seat ${seat.isBooked ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : 'available'}`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.id}
                </div>
              ))}
            </div>
          </div>
          <div className="booking-oder">
              <p><strong>Ghế ngồi:</strong> {selectedSeats.join(', ')}</p>
              <p><strong>Tổng tiền:</strong> {totalPrice.toLocaleString()} VND</p>
          </div>
          <div className="movie-info">
            <h2>Thông tin chi tiết về phim</h2>
            {bookingInfo && (
              <>
                <img src={bookingInfo.imageUrl} alt={bookingInfo.movieTitle} />
                <div className="details">
                  <p><strong>Tên phim:</strong> {bookingInfo.movieTitle}</p>
                  <p><strong>Thể loại:</strong> {bookingInfo.genre}</p>
                  <p><strong>Thời lượng:</strong> {bookingInfo.description}</p>
                  <p><strong>Rạp chiếu:</strong> {bookingInfo.cinema}</p>
                  <p><strong>Ngày chiếu:</strong> {moment(bookingInfo.date).format('DD/MM/YYYY')}</p>
                  <p><strong>Giờ chiếu:</strong> {bookingInfo.time}</p>
  
                </div>
              </>
            )}
            <div className="button-container">
              <button className='booking-btn' onClick={() => navigate('/')}>Quay lại</button>
              <button className="booking-btn" type="button" onClick={handleBooking}>Tiếp tục</button>
            </div>
          </div>
          <div className="legend">
            <div className="available">
              <span></span> <p>Ghế trống</p>
            </div>
            <div className="selected">
              <span></span> <p>Ghế đang chọn</p>
            </div>
            <div className="booked">
              <span></span> <p>Ghế đã đặt</p>
            </div>
          </div>
        </div>
      </div>
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </div>
  );
};

export default MovieDetail;