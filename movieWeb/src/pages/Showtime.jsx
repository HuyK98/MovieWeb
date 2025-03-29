import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import axios from "axios";
import "../styles/Showtime.css";
import moment from "moment";

const Showtime = () => {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movieShowtimes, setMovieShowtimes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // trừ các số ghế đã đặt
  const [availableSeats, setAvailableSeats] = useState(70);
  const [bookings, setBookings] = useState([]); // Thêm state để lưu trữ dữ liệu bookings

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xem lịch chiếu và giờ chiếu
  const handleBuyTicketClick = async (movie) => {
    setSelectedMovie(movie);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/showtimes?movieId=${movie._id}`
      );

      // Chuyển đổi date từ chuỗi ISO thành kiểu Date
      const showtimesWithDate = response.data.map((showtime) => ({
        ...showtime,
        date: new Date(showtime.date), // Chuyển đổi thành đối tượng Date
      }));

      setShowtimes(response.data);
      if (response.data.length > 0) {
        setSelectedShowtime(response.data[0]); // Tự động chọn ngày đầu tiên
      }
    } catch (error) {
      console.error("Lỗi khi lấy lịch chiếu:", error);
    }
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeat(null);
    setBookingInfo(null);
  };

  const handleSeatClick = (showtime, timeSlot) => {
    setSelectedSeat(timeSlot);
    setSelectedShowtime({
      ...showtime,
      time: timeSlot.time, // Gán giá trị time từ timeSlot
    });
    setBookingInfo({
      _id: selectedMovie._id,
      movieTitle: selectedMovie.title,
      imageUrl: selectedMovie.imageUrl,
      genre: selectedMovie.genre,
      description: selectedMovie.description,
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

  // Fetch movies and showtimes from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movies
        const moviesResponse = await axios.get(
          "http://localhost:5000/api/movies"
        );
        setMovies(moviesResponse.data);

        // Fetch showtimes
        const showtimesResponse = await axios.get(
          "http://localhost:5000/api/showtimes"
        );
        setShowtimes(showtimesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Process data when selectedDate changes
  useEffect(() => {
    const processShowtimesData = () => {
      const formattedSelectedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
        .toISOString()
        .split("T")[0];

      const filteredShowtimes = showtimes.filter((showtime) => {
        const showtimeDate = new Date(showtime.date);
        const normalizedShowtimeDate = new Date(
          showtimeDate.getFullYear(),
          showtimeDate.getMonth(),
          showtimeDate.getDate()
        )
          .toISOString()
          .split("T")[0];

        return normalizedShowtimeDate === formattedSelectedDate;
      });

      // Map movies with their showtimes
      const moviesWithShowtimes = filteredShowtimes.map((showtime) => {
        const movie = showtime.movieId;
        return {
          ...movie,
          showtime: showtime.times,
        };
      });

      setMovieShowtimes(moviesWithShowtimes);
    };

    if (showtimes.length > 0) {
      processShowtimesData();
    }
  }, [showtimes, selectedDate]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleDateClick = (date) => {
    const normalizedDate = new Date(date);
    console.log("handleDateClick - Normalized date:", normalizedDate);

    // Tìm showtime cho ngày được chọn
    const showtimeForDate = showtimes.find(
      (showtime) =>
        new Date(showtime.date).toDateString() === normalizedDate.toDateString()
    );

    if (showtimeForDate) {
      setSelectedShowtime(showtimeForDate);
    } else {
      console.warn("No showtime found for the selected date.");
      setSelectedShowtime(null); // Xóa showtime nếu không tìm thấy
    }

    setSelectedDate(normalizedDate);
    setSelectedSeat(null);
  };

  const generateDates = () => {
    const dates = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Lấy số ngày trong tháng hiện tại
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const dates = generateDates();

  // Thêm useEffect để lấy dữ liệu từ bookings
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!selectedMovie || !selectedShowtime) {
        console.warn("Missing required parameters for fetching booked seats.");
        return;
      }

      try {
        const formattedDate = moment(new Date(selectedShowtime.date)).format(
          "YYYY-MM-DD"
        );
        console.log("fetchBookedSeats - movieTitle:", selectedMovie.title);
        console.log("fetchBookedSeats - formattedDate:", formattedDate);

        const response = await axios.get(
          "http://localhost:5000/api/payment/seats/page",
          {
            params: {
              movieTitle: selectedMovie.title,
              date: formattedDate,
            },
          }
        );

        const bookedSeatsByTime = response.data;
        console.log("Booked seats by time:", bookedSeatsByTime);

        // Tính số ghế còn trống cho từng khung giờ
        const totalSeats = 70; // Tổng số ghế
        const availableSeatsByTime = bookedSeatsByTime.map((slot) => ({
          time: slot.time,
          availableSeats: totalSeats - slot.bookedSeats,
        }));

        console.log("Available seats by time:", availableSeatsByTime);

        setBookings(availableSeatsByTime); // Lưu danh sách số ghế còn trống theo từng khung giờ
      } catch (error) {
        console.error("Error fetching booked seats:", error);
      }
    };

    fetchBookedSeats();
  }, [selectedMovie, selectedShowtime]);

  return (
    <div className="new-showtime-container">
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <h1 className="page-title">Lịch Chiếu Phim</h1>
      {/* Date selection */}
      <div className="date-selector">
        <div className="month-navigation">
          <button onClick={handlePreviousMonth}>Tháng trước</button>
          <span>
            {currentMonth.toLocaleDateString("vi-VN", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button onClick={handleNextMonth}>Tháng sau</button>
        </div>
        <div className="dates-grid">
          {dates.slice(0, 7).map((date, index) => (
            <div
              key={index}
              className={`date-item ${
                date.toDateString() === selectedDate.toDateString()
                  ? "active"
                  : ""
              }`}
              onClick={() => handleDateClick(date)}
            >
              <div className="date-day">{date.getDate()}</div>
              <div className="date-info">
                <div className="date-weekday">
                  {date.toLocaleDateString("vi-VN", { weekday: "short" })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="view-full-calendar"
          onClick={() => setShowFullCalendar(true)}
        >
          Xem lịch đầy đủ
        </button>

        {/* Full calendar modal */}
        {showFullCalendar && (
          <div className="full-calendar-modal">
            <div className="full-calendar-content">
              <button
                className="close-calendar"
                onClick={() => setShowFullCalendar(false)}
              >
                Đóng
              </button>
              <div className="dates-grid-full">
                {dates.map((date, index) => (
                  <div
                    key={index}
                    className={`date-item ${
                      date.toDateString() === selectedDate.toDateString()
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      handleDateClick(date);
                      setShowFullCalendar(false); // Đóng modal sau khi chọn ngày
                    }}
                  >
                    <div className="date-day">{date.getDate()}</div>
                    <div className="date-info">
                      <div className="date-weekday">
                        {date.toLocaleDateString("vi-VN", { weekday: "short" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Movie list with showtimes */}
      <div className="movies-list">
        {movieShowtimes.length > 0 ? (
          movieShowtimes.map((movie) => (
            <div key={movie._id} className="movie-card">
              <div className="movie-poster">
                <img src={movie.imageUrl} alt={movie.title} />
              </div>
              <div className="movie-details">
                <h2>{movie.title}</h2>
                <p className="movie-description">Mô tả: {movie.description}</p>
                <p className="movie-genre">Thể loại: {movie.genre}</p>
                <p className="movie-release-date">
                  Ngày phát hành: {formatDate(movie.releaseDate)}
                </p>
                <div className="showtime-list">
                  {movie.showtime.map((time, index) => {
                    // Tìm số ghế còn trống cho khung giờ hiện tại
                    const booking = bookings.find((b) => b.time === time.time);
                    const availableSeats = booking
                      ? booking.availableSeats
                      : 70; // Nếu không có dữ liệu, mặc định là 70

                    return (
                      <div
                        key={index}
                        className="showtime-item"
                        onClick={() => handleBuyTicketClick(movie)}
                      >
                        <span className="showtime-hour">{time.time}</span>
                        <span className="seats-available">
                          {availableSeats} ghế trống
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-movies">
            <p>
              Không có lịch chiếu cho ngày {formatDate(selectedDate)}. Vui lòng
              chọn ngày khác.
            </p>
          </div>
        )}
      </div>
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

      {showPopup && selectedMovie && (
        <div className="showtimes-pop-up">
          <div className="showtimes-content">
            <button className="close-button" onClick={handleClosePopup}>
              X
            </button>
            <h2>LỊCH CHIẾU - {selectedMovie.title}</h2>
            <h1>Rạp CINEMA</h1>
            <ul className="date-showtime">
              {showtimes
                .map((showtime) => showtime.date)
                .filter((date, index, self) => self.indexOf(date) === index)
                .map((date) => (
                  <li
                    key={date}
                    onClick={() => handleDateClick(new Date(date))}
                    className={
                      selectedShowtime && selectedShowtime.date === date
                        ? "selected"
                        : ""
                    }
                  >
                    {formatDate(date)}
                  </li>
                ))}
            </ul>
            {selectedShowtime && (
              <div className="seats">
                {selectedShowtime.times.map((timeSlot) => {
                  // Tìm số ghế còn trống cho khung giờ hiện tại
                  const booking = bookings.find(
                    (b) => b.time === timeSlot.time
                  );
                  const availableSeats = booking ? booking.availableSeats : 70; // Nếu không có dữ liệu, mặc định là 70

                  return (
                    <div
                      key={timeSlot._id}
                      className={`seat ${
                        timeSlot.isBooked ? "booked" : "available"
                      }`}
                      onClick={() =>
                        handleSeatClick(selectedShowtime, timeSlot)
                      }
                    >
                      <p>Giờ: {timeSlot.time}</p>
                      <p>{availableSeats} ghế trống</p>{" "}
                      {/* Hiển thị số ghế còn trống */}
                      <div className="seat-status">
                        {timeSlot.isBooked ? "Đã đặt" : "Ghế trống"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {bookingInfo && (
            <div className="booking-info">
              <button className="close-button" onClick={handleClosePopup}>
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
              <button className="confirm-button" onClick={handleConfirmBooking}>
                ĐỒNG Ý
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Showtime;
