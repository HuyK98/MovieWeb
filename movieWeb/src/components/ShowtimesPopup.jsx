import React from "react";
import moment from "moment";
import "../styles/ShowtimesPopup.css";

const ShowtimesPopup = ({
  showPopup,
  selectedMovie,
  showtimes,
  selectedShowtime,
  bookings,
  activeSeat,
  bookingInfo,
  handleCloseShowtimesPopup,
  handleClosePopup,
  handleDateClick,
  handleSeatClick,
  handleCloseBookingInfo,
  handleConfirmBooking,
  formatDate,
}) => {
  if (!showPopup || !selectedMovie) return null;

  return (
    <div className="showtimes-pop-up" onClick={handleCloseShowtimesPopup}>
      <div className="showtimes-content" onClick={(e) => e.stopPropagation()}>
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
                onClick={() => handleDateClick(date)}
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
              const booking = bookings.find((b) => b.time === timeSlot.time);
              const availableSeats = booking ? booking.availableSeats : 70;

              return (
                <div
                  key={timeSlot._id}
                  className={`seat ${
                    timeSlot.isBooked ? "booked" : "available"
                  } ${activeSeat === timeSlot.time ? "active" : ""}`}
                  onClick={() => handleSeatClick(selectedShowtime, timeSlot)}
                >
                  <p>Giờ: {timeSlot.time}</p>
                  <p>{availableSeats} ghế trống</p>
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
          <button className="close-button" onClick={handleCloseBookingInfo}>
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
  );
};

export default ShowtimesPopup;