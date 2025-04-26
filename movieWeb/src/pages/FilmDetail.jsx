import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FilmDetail.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import moment from "moment";
import API_URL from "../api/config"; // Import API_URL từ config

const FilmDetail = () => {
  const { movieId } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [bookingPosition, setBookingPosition] = useState({ top: 0, left: 0 });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookings, setBookings] = useState([]); // Thêm state để lưu trữ dữ liệu bookings
  const [isscroll, setIsScrolled] = useState(false); // Thêm state để theo dõi trạng thái cuộn
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage khi component được mount
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch thông tin phim và lịch chiếu
        setLoading(true);
        const movieResponse = await axios.get(
          `${API_URL}/api/movies/${movieId}`
        );
        setMovie(movieResponse.data);

        const showtimeResponse = await axios.get(
          `${API_URL}/api/showtimes?movieId=${movieId}`
        );
        const showtimeData = showtimeResponse.data;
        setShowtimes(showtimeData);

        // Tự động chọn ngày đầu tiên nếu có lịch chiếu
        if (showtimeData.length > 0) {
          const uniqueDates = [
            ...new Set(showtimeData.map((item) => item.date)),
          ];
          setSelectedDate(uniqueDates[0]);
          const initialShowtime = showtimeData.find(
            (showtime) => showtime.date === uniqueDates[0]
          );
          setSelectedShowtime(initialShowtime);

          // Fetch thông tin ghế đã đặt cho ngày đầu tiên
          await fetchSeats(movieResponse.data.title, uniqueDates[0]);

          // const formattedDate = moment(new Date(initialShowtime.date)).format(
          //   "YYYY-MM-DD"
          // );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "Không thể tải thông tin phim hoặc ghế. Vui lòng thử lại sau."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  // Fetch thông tin ghế khi ngày thay đổi
  useEffect(() => {
    if (selectedDate && movie) {
      fetchSeats(movie.title, selectedDate);
    }
  }, [selectedDate, movie]);

  const fetchSeats = async (movieTitle, date) => {
    try {
      const formattedDate = moment(new Date(date)).format("YYYY-MM-DD");
      const bookedSeatsResponse = await axios.get(
        `${API_URL}/api/payment/seats/page`,
        {
          params: {
            movieTitle: movieTitle,
            date: formattedDate,
          },
        }
      );

      const bookedSeatsByTime = bookedSeatsResponse.data || [];
      const totalSeats = 70; // Tổng số ghế
      const availableSeatsByTime = bookedSeatsByTime.map((slot) => ({
        time: slot.time,
        availableSeats: totalSeats - slot.bookedSeats,
      }));

      setBookings(availableSeatsByTime);
    } catch (error) {
      console.error("Error fetching seats:", error);
      setBookings([]); // Đặt danh sách ghế trống nếu có lỗi
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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const selected = showtimes.find((showtime) => showtime.date === date);
    setSelectedShowtime(selected);
  };

  const handleSeatClick = (showtime, timeSlot, event) => {
    const rect = event.target.getBoundingClientRect();
    setBookingPosition({
      top: rect.top + window.scrollY + rect.height + 10,
      left: rect.left + window.scrollX,
    });
    setSelectedSeat(timeSlot);
    setSelectedShowtime({
      ...showtime,
      time: timeSlot.time, // Gán giá trị time từ timeSlot
    });

    setBookingInfo({
      _id: movie._id,
      movieTitle: movie.title,
      imageUrl: movie.imageUrl,
      genre: movie.genre,
      description: movie.description,
      cinema: "Rạp CINEMA",
      date: showtime.date,
      time: timeSlot.time,
      seat: timeSlot.seats,
      status: timeSlot.isBooked ? "Đã đặt" : "Ghế trống",
    });
  };

  const handleConfirmBooking = () => {
    const isLoggedIn = localStorage.getItem("userInfo");
    if (!isLoggedIn) {
      navigate("/login", { state: { bookingInfo } });
    } else {
      navigate("/movie-detail", { state: { bookingInfo } });
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  if (loading) {
    return (
      <div className="film-detail-container loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-message">Đang tải thông tin phim...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="film-detail-container error-container">
        <p className="error-message">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Thử lại
        </button>
      </div>
    );
  }

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

  return (
    <div className="home-content">
      <div className="film-detail-container">
        <Header
          user={user}
          handleLogout={handleLogout}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          isScrolled={isscroll} // Truyền giá trị isScrolled vào Header
        />
        {movie ? (
          <>
            <div className="film-header">
              <h1>{movie.title}</h1>
            </div>

            <div className="film-content">
              {/* Poster Section */}
              <div className="film-poster-container">
                <img
                  src={movie.imageUrl}
                  alt={movie.title}
                  className="film-poster"
                />
              </div>

              {/* Details and Showtimes Section */}
              <div className="film-details-showtimes-container">
                {/* Details Section */}
                <div className="film-main-content">
                  <div className="film-info-container">
                    <div className="film-details">
                      <div className="detail-item">
                        <span className="detail-label">Thể Loại:</span>
                        <span className="detail-value">{movie.genre}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Mô tả:</span>
                        <span className="detail-value">
                          {movie.description}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Ngày Phát Hành:</span>
                        <span className="detail-value">
                          {formatDate(movie.releaseDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Showtimes Section */}
                <div className="film-showtimes-section">
                  <h3>Lịch chiếu:</h3>
                  <div className="date-selection">
                    {showtimes
                      .map((showtime) => showtime.date)
                      .filter(
                        (date, index, self) => self.indexOf(date) === index
                      )
                      .map((date) => (
                        <button
                          key={date}
                          onClick={() => handleDateClick(date)}
                          className={selectedDate === date ? "selected" : ""}
                        >
                          {formatDate(date)}
                        </button>
                      ))}
                  </div>

                  {selectedShowtime ? (
                    <div className="showtime-list">
                      {selectedShowtime.times.map((timeSlot, index) => {
                        // Tìm số ghế còn trống cho khung giờ hiện tại
                        const booking = bookings.find(
                          (b) => b.time === timeSlot.time
                        );
                        const availableSeats = booking
                          ? booking.availableSeats
                          : 70; // Hiển thị thông báo nếu không có dữ liệu

                        return (
                          <div
                            key={index}
                            className={`showtime-item ${
                              timeSlot.isBooked ? "booked" : "available"
                            }`}
                            onClick={(event) =>
                              !timeSlot.isBooked &&
                              handleSeatClick(selectedShowtime, timeSlot, event)
                            }
                          >
                            <span className="showtime-hour">
                              {timeSlot.time}
                            </span>
                            <span className="seats-available">
                              {timeSlot.isBooked
                                ? "Đã đặt"
                                : `${availableSeats} ghế trống`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="no-showtimes">
                      Vui lòng chọn ngày để xem lịch chiếu.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Trailer Section */}
            <div className="trailer-section">
              <span className="section-title">TRAILER</span>
              <div className="video-container">
                <iframe
                  src={movie.videoUrl}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="trailer-video"
                ></iframe>
              </div>
            </div>

            {/* Booking Info Section */}
            {bookingInfo && (
              <div
                className="booking-info"
                style={{
                  position: "absolute",
                  top: `${bookingPosition.top}px`,
                  left: `${bookingPosition.left}px`,
                  zIndex: 1000,
                }}
              >
                <button
                  className="close-button"
                  onClick={() => setBookingInfo(null)}
                >
                  X
                </button>
                <h3>BẠN ĐANG ĐẶT VÉ XEM PHIM</h3>
                <h2>{bookingInfo.movieTitle}</h2>
                <table>
                  <tbody>
                    <tr>
                      <th>RẠP CHIẾU</th>
                      <th>NGÀY CHIẾU</th>
                      <th>GIỜ CHIẾU</th>
                    </tr>
                    <tr>
                      <td>{bookingInfo.cinema}</td>
                      <td>{formatDate(bookingInfo.date)}</td>
                      <td>{bookingInfo.time}</td>
                    </tr>
                  </tbody>
                </table>
                <button
                  className="confirm-button"
                  onClick={handleConfirmBooking}
                >
                  ĐỒNG Ý
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="loading-message">Không tìm thấy thông tin phim.</p>
        )}
        <Footer
          class="FilmDetail-Footer"
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default FilmDetail;