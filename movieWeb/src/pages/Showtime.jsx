import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import axios from "axios";
import "../styles/Showtime.css";
import moment from "moment";

const Showtime = () => {
  const [movie, setMovie] = useState(null);
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
  const [isScrolled, setIsScrolled] = useState(false);


  // trừ các số ghế đã đặt
  const [availableSeats, setAvailableSeats] = useState(70);
  const [bookings, setBookings] = useState([]); // Thêm state để lưu trữ dữ liệu bookings
  // edit lại style cho bookingInfo
  const [bookingPosition, setBookingPosition] = useState({ top: 0, left: 0 });


  const handleCloseShowtimesPopup = (e) => {
    // Nếu có sự kiện và nhấp vào bên trong nội dung popup, không đóng
    if (e && e.target.closest(".showtimes-content")) {
      return;
    }
    setShowPopup(false);
    setSelectedMovie(null);
    setSelectedShowtime(null);
    setSelectedSeat(null);
    setBookingInfo(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCloseShowtimesPopup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

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

  const handleSeatClick = (movie, showtime, timeSlot, event) => {
    if (!movie) {
      console.warn("Movie is undefined in handleSeatClick.");
      return;
    }

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

  // Fetch movies and showtimes from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch movies
        const moviesResponse = await axios.get(
          "http://localhost:5000/api/movies"
        );
        console.log("Movies fetched:", moviesResponse.data);
        setMovie(moviesResponse.data);

        // Fetch showtimes
        const showtimesResponse = await axios.get(
          "http://localhost:5000/api/showtimes"
        );
        console.log("Showtimes fetched:", showtimesResponse.data);
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

      // Cập nhật selectedMovie từ showtime
      const selectedMovie = movie.find(
        (m) => m._id === showtimeForDate.movieId._id
      );
      if (selectedMovie) {
        setSelectedMovie(selectedMovie);
        console.log("Selected movie:", selectedMovie);
      } else {
        console.warn("No movie found for the selected showtime.");
        console.log("Showtime for date:", showtimeForDate);
      }
    } else {
      console.warn("No showtime found for the selected date.");
      console.log("Normalized date:", normalizedDate);
      console.log("Showtimes:", showtimes);
      setSelectedShowtime(null); // Xóa showtime nếu không tìm thấy
      setSelectedMovie(null); // Xóa selectedMovie nếu không tìm thấy
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
  const fetchBookedSeats = async () => {
    if (!selectedShowtime || !selectedShowtime.date) {
      console.warn("Missing required parameters for fetching booked seats.");
      return;
    }

    try {
      const formattedDate = moment(selectedShowtime.date).format("YYYY-MM-DD");

      const response = await axios.get(
        "http://localhost:5000/api/payment/seats/page",
        {
          params: {
            date: formattedDate, // Chỉ truyền ngày, không truyền movieTitle
          },
        }
      );

      const bookedSeatsByMovie = response.data;
      console.log("Booked seats by movie:", bookedSeatsByMovie);

      // Tính số ghế còn trống cho từng phim và từng khung giờ
      const totalSeats = 70; // Tổng số ghế
      const availableSeatsByMovie = bookedSeatsByMovie.reduce((acc, slot) => {
        const key = `${slot.movieTitle}-${slot.time}`;
        acc[key] = totalSeats - slot.bookedSeats;
        return acc;
      }, {});

      console.log("Available seats by movie:", availableSeatsByMovie);

      setBookings(availableSeatsByMovie); // Lưu danh sách số ghế còn trống theo từng phim
    } catch (error) {
      console.error("Error fetching booked seats:", error);
    }
  };

  useEffect(() => {
    if (selectedMovie && selectedShowtime) {
      console.log(
        "Calling fetchBookedSeats with:",
        selectedMovie,
        selectedShowtime
      );
      fetchBookedSeats(selectedMovie); // Truyền selectedMovie thay vì movie
    }
  }, [selectedMovie, selectedShowtime]);

  return (
    <div className="new-showtime-container">
      <Header
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        isScrolled={isScrolled}

      />
      <div className="home-content" >
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
          onClick={() => {
            setShowFullCalendar(true);
            fetchBookedSeats(selectedMovie); // Gọi hàm để lấy dữ liệu ghế đã đặt khi mở modal
          }}
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
                  {movie.showtime.length > 0 ? (
                    movie.showtime.map((timeSlot, index) => {
                      const key = `${movie.title}-${timeSlot.time}`;
                      const availableSeats = bookings[key] || 70; // Lấy số ghế còn trống từ bookings

                      return (
                        <div
                          key={index}
                          className={`seat ${
                            timeSlot.isBooked ? "booked" : "available"
                          }`}
                          onClick={(event) =>
                            !timeSlot.isBooked &&
                            handleSeatClick(
                              movie,
                              selectedShowtime,
                              timeSlot,
                              event
                            )
                          }
                        >
                          <span className="showtime-hour">{timeSlot.time}</span>
                          <span className="seats-available">
                            {availableSeats} ghế trống
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p>Không có lịch chiếu nào được chọn.</p>
                  )}
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
          <button className="close-button" onClick={() => setBookingInfo(null)}>
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
      {/* Footer */}
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </div>
    </div>
  );
};

export default Showtime;
