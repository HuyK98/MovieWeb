import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import axios from "axios";
import "../styles/Showtime.css";
import moment from "moment";
import { useLanguage } from "../pages/LanguageContext";
import translations from "../pages/translations";


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
  const [availableSeats, setAvailableSeats] = useState(70);
  const [bookings, setBookings] = useState([]);
  const [bookingPosition, setBookingPosition] = useState({ top: 0, left: 0 });

  const { language } = useLanguage();


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser(null);
    }
    document.title = translations[language].title;
  }, [language]);

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

  const handleBuyTicketClick = async (movie) => {
    setSelectedMovie(movie);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/showtimes?movieId=${movie._id}`
      );
      const showtimesWithDate = response.data.map((showtime) => ({
        ...showtime,
        date: new Date(showtime.date),
      }));
      setShowtimes(response.data);
      if (response.data.length > 0) {
        setSelectedShowtime(response.data[0]);
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
      time: timeSlot.time,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesResponse = await axios.get("http://localhost:5000/api/movies");
        setMovie(moviesResponse.data);
        const showtimesResponse = await axios.get("http://localhost:5000/api/showtimes");
        setShowtimes(showtimesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const processShowtimesData = () => {
      const formattedSelectedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      ).toISOString().split("T")[0];

      const filteredShowtimes = showtimes.filter((showtime) => {
        const showtimeDate = new Date(showtime.date);
        const normalizedShowtimeDate = new Date(
          showtimeDate.getFullYear(),
          showtimeDate.getMonth(),
          showtimeDate.getDate()
        ).toISOString().split("T")[0];
        return normalizedShowtimeDate === formattedSelectedDate;
      });

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
    return new Date(dateString).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", options);
  };

  const handleDateClick = (date) => {
    const normalizedDate = new Date(date);
    const showtimeForDate = showtimes.find(
      (showtime) => new Date(showtime.date).toDateString() === normalizedDate.toDateString()
    );
    if (showtimeForDate) {
      setSelectedShowtime(showtimeForDate);
      const selectedMovie = movie.find((m) => m._id === showtimeForDate.movieId._id);
      if (selectedMovie) {
        setSelectedMovie(selectedMovie);
      }
    } else {
      setSelectedShowtime(null);
      setSelectedMovie(null);
    }
    setSelectedDate(normalizedDate);
    setSelectedSeat(null);
  };

  const generateDates = () => {
    const dates = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }
    return dates;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const dates = generateDates();

  const fetchBookedSeats = async () => {
    if (!selectedShowtime || !selectedShowtime.date) {
      console.warn("Missing required parameters for fetching booked seats.");
      return;
    }
    try {
      const formattedDate = moment(selectedShowtime.date).format("YYYY-MM-DD");
      const response = await axios.get("http://localhost:5000/api/payment/seats/page", {
        params: { date: formattedDate },
      });
      const bookedSeatsByMovie = response.data;
      const totalSeats = 70;
      const availableSeatsByMovie = bookedSeatsByMovie.reduce((acc, slot) => {
        const key = `${slot.movieTitle}-${slot.time}`;
        acc[key] = totalSeats - slot.bookedSeats;
        return acc;
      }, {});
      setBookings(availableSeatsByMovie);
    } catch (error) {
      console.error("Error fetching booked seats:", error);
    }
  };

  useEffect(() => {
    if (selectedMovie && selectedShowtime) {
      fetchBookedSeats(selectedMovie);
    }
  }, [selectedMovie, selectedShowtime]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-content">
      <div className="new-showtime-container">
        <Header
          user={user}
          handleLogout={handleLogout}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          isScrolled={isScrolled}
        />
        <h1 className="page-title">{translations[language].title}</h1>
        {/* Rest of the JSX remains the same as in the previous version */}
        <div className="date-selector">
          <div className="month-navigation">
            <button onClick={handlePreviousMonth}>{translations[language].previousMonth}</button>
            <span>
              {currentMonth.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={handleNextMonth}>{translations[language].nextMonth}</button>
          </div>
          <div className="dates-grid">
            {dates.slice(0, 7).map((date, index) => (
              <div
                key={index}
                className={`date-item ${date.toDateString() === selectedDate.toDateString() ? "active" : ""}`}
                onClick={() => handleDateClick(date)}
              >
                <div className="date-day">{date.getDate()}</div>
                <div className="date-info">
                  <div className="date-weekday">
                    {date.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", { weekday: "short" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="view-full-calendar"
            onClick={() => {
              setShowFullCalendar(true);
              fetchBookedSeats(selectedMovie);
            }}
          >
            {translations[language].viewFullCalendar}
          </button>

          {showFullCalendar && (
            <div className="full-calendar-modal">
              <div className="full-calendar-content">
                <button
                  className="close-calendar"
                  onClick={() => setShowFullCalendar(false)}
                >
                  {translations[language].close}
                </button>
                <div className="dates-grid-full">
                  {dates.map((date, index) => (
                    <div
                      key={index}
                      className={`date-item ${date.toDateString() === selectedDate.toDateString() ? "active" : ""}`}
                      onClick={() => {
                        handleDateClick(date);
                        setShowFullCalendar(false);
                      }}
                    >
                      <div className="date-day">{date.getDate()}</div>
                      <div className="date-info">
                        <div className="date-weekday">
                          {date.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", { weekday: "short" })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="movies-list">
          {movieShowtimes.length > 0 ? (
            movieShowtimes.map((movie) => (
              <div key={movie._id} className="movie-card">
                <div className="movie-poster">
                  <img src={movie.imageUrl} alt={movie.title} />
                </div>
                <div className="movie-details">
                  <h2>{movie.title}</h2>
                  <p className="movie-description">{translations[language].description}: {movie.description}</p>
                  <p className="movie-genre">{translations[language].genre}: {movie.genre}</p>
                  <p className="movie-release-date">
                    {translations[language].releaseDate}: {formatDate(movie.releaseDate)}
                  </p>
                  <div className="showtime-list">
                    {movie.showtime.length > 0 ? (
                      movie.showtime.map((timeSlot, index) => {
                        const key = `${movie.title}-${timeSlot.time}`;
                        const availableSeats = bookings[key] || 70;
                        return (
                          <div
                            key={index}
                            className={`seat ${timeSlot.isBooked ? "booked" : "available"}`}
                            onClick={(event) =>
                              !timeSlot.isBooked &&
                              handleSeatClick(movie, selectedShowtime, timeSlot, event)
                            }
                          >
                            <span className="showtime-hour">{timeSlot.time}</span>
                            <span className="seats-available">
                              {availableSeats} {translations[language].availableSeats}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p>{translations[language].noShowtimeSelected}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-movies">
              <p>
                {translations[language].noShowtimes} {formatDate(selectedDate)}. {translations[language].pleaseSelectAnother}.
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
            <h3>{translations[language].bookingTitle}</h3>
            <h2>{bookingInfo.movieTitle}</h2>
            <table>
              <tbody>
                <tr>
                  <th>{translations[language].cinema}</th>
                  <th>{translations[language].showDate}</th>
                  <th>{translations[language].showTime}</th>
                </tr>
                <tr>
                  <td>{bookingInfo.cinema}</td>
                  <td>{formatDate(bookingInfo.date)}</td>
                  <td>{bookingInfo.time}</td>
                </tr>
              </tbody>
            </table>
            <button className="confirm-button" onClick={handleConfirmBooking}>
              {translations[language].confirm}
            </button>
          </div>
        )}
        
        <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default Showtime;