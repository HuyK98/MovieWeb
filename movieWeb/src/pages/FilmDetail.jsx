import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/FilmDetail.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setLoading(true);
            try {
                const movieResponse = await axios.get(
                    `http://localhost:5000/api/movies/${movieId}`
                );
                setMovie(movieResponse.data);

                const showtimeResponse = await axios.get(
                    `http://localhost:5000/api/showtimes?movieId=${movieId}`
                );
                const showtimeData = showtimeResponse.data;
                setShowtimes(showtimeData);

                // Automatically select the first date if showtimes are available
                if (showtimeData.length > 0) {
                    const uniqueDates = [...new Set(showtimeData.map((item) => item.date))];
                    setSelectedDate(uniqueDates[0]);
                    const initialShowtime = showtimeData.find(showtime => showtime.date === uniqueDates[0]);
                    setSelectedShowtime(initialShowtime);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching movie details or showtimes:", error);
                setError("Không thể tải thông tin phim. Vui lòng thử lại sau.");
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

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

        setBookingInfo({
            _id: movie._id,
            movieTitle: movie.title,
            imageUrl: movie.imageUrl,
            genre: movie.genre,
            description: movie.description,
            cinema: "Rạp CINEMA",
            date: formatDate(showtime.date),
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
                <button className="retry-button" onClick={() => window.location.reload()}>
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
        <div className="film-detail-container">
            <Header
                user={user}
                handleLogout={handleLogout}
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
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
                                            <span className="detail-value">{movie.description}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Ngày Phát Hành:</span>
                                            <span className="detail-value">{formatDate(movie.releaseDate)}</span>
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
                                        .filter((date, index, self) => self.indexOf(date) === index)
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
                                        {selectedShowtime.times.map((timeSlot, index) => (
                                            <div
                                                key={index}
                                                className={`showtime-item ${timeSlot.isBooked ? "booked" : "available"}`}
                                                onClick={() => !timeSlot.isBooked && handleSeatClick(selectedShowtime, timeSlot, event)}
                                            >
                                                <span className="showtime-hour">{timeSlot.time}</span>
                                                <span className="seats-available">
                                                    {timeSlot.isBooked ? "Đã đặt" : `${timeSlot.seats} ghế trống`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-showtimes">Vui lòng chọn ngày để xem lịch chiếu.</p>
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
                                        <td>{bookingInfo.date}</td>
                                        <td>{bookingInfo.time}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="confirm-button" onClick={handleConfirmBooking}>
                                ĐỒNG Ý
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="loading-message">Không tìm thấy thông tin phim.</p>
            )}
            <Footer class="FilmDetail-Footer" toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        </div>
    );
};

export default FilmDetail;