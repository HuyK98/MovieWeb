import React, { useState,useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../styles/MovieDetail.css';
import logo from "../assets/logo.jpg";
import axios from 'axios';

const MovieDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingInfo } = location.state || {};

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        if (!bookingInfo || !bookingInfo.movieTitle || !bookingInfo.date || !bookingInfo.time) {
          console.error('bookingInfo hoặc các trường cần thiết là undefined');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/payment/seats', {
          params: {
            movieTitle: bookingInfo.movieTitle,
            date: bookingInfo.date,
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
    navigate('/payment', { state: { bookingInfo, selectedSeats, totalPrice } });
  };

  return (
    <div>
      <header>
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <nav>
          <ul>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/tvshows">TV Shows</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>
      <div className="movie-detail-container">
        <p className='map-seats'>Sơ đồ ghế ngồi</p>
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
        <div className="movie-info">
          <h2>Thông tin chi tiết về phim</h2>
          <img src={bookingInfo.imageUrl} />
          <div className="details">
            <p><strong>Tên phim:</strong> {bookingInfo.movieTitle}</p>
            <p><strong>Thể loại:</strong> {bookingInfo.genre}</p>
            <p><strong>Thời lượng:</strong> {bookingInfo.description}</p>
            <p><strong>Rạp chiếu:</strong> {bookingInfo.cinema}</p>
            <p><strong>Ngày chiếu:</strong> {bookingInfo.date}</p>
            <p><strong>Giờ chiếu:</strong> {bookingInfo.time}</p>
            <p><strong>Ghế ngồi:</strong> {selectedSeats.join(', ')}</p>
            <p><strong>Tổng tiền:</strong> {totalPrice.toLocaleString()} VND</p>
          </div>
          <button className='button-btn' type="button" onClick={handleBooking}>Tiếp tục</button>
        </div>
        <div className="legend">
            <div className="available">
              <span></span> Ghế trống
            </div>
            <div className="selected">
              <span></span> Ghế đang chọn
            </div>
            <div className="booked">
              <span></span> Ghế đã đặt
            </div>
          </div>
      </div>
    </div>
  );
};

export default MovieDetail;