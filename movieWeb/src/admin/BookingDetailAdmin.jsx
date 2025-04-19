import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import HeaderAdmin from "./admin_layout/HeaderAdmin";
import Sidebar from "./admin_layout/Sidebar";
import "../styles/BookingDetail.css";
import { FaBars } from "react-icons/fa";
const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const billRef = useRef(null);
  const [base64Image, setBase64Image] = useState("");
  const [user, setUser] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State để quản lý trạng thái collapse
  const [loading, setLoading] = useState(true);

  // Fetch booking data
  useEffect(() => {
    const fetchBookingAndMovie = async () => {
      try {
        setLoading(true); // Bắt đầu tải
        // Fetch booking data
        console.log('Fetching booking for ID:', bookingId);
        const bookingResponse = await fetch(
          `http://localhost:5000/api/bookings/booking/${bookingId}`
        );
        if (!bookingResponse.ok) {
          throw new Error(`HTTP error! status: ${bookingResponse.status}`);
        }
        const bookingData = await bookingResponse.json();
        console.log('Booking data:', bookingData);

        // Fetch movies data
        const moviesResponse = await fetch("http://localhost:5000/api/movies");
        if (!moviesResponse.ok) {
          throw new Error(`HTTP error! status: ${moviesResponse.status}`);
        }
        const moviesData = await moviesResponse.json();
        console.log('Movies data:', moviesData);

        // Tìm phim khớp với movieTitle trong booking
        const movie = moviesData.find(
          (m) => m.title === bookingData.movieTitle
        );
        if (movie) {
          setBooking({
            ...bookingData,
            movie: {
              ...movie,
            },
          });
        } else {
          setBooking(bookingData); // Nếu không tìm thấy phim, chỉ set dữ liệu booking
        }
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      } finally {
        setLoading(false); // Kết thúc tải
      }
    };

    fetchBookingAndMovie();
  }, [bookingId]);

  // Convert image URL to Base64
  const convertImageToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Lỗi khi chuyển đổi hình ảnh:", error);
      return null;
    }
  };

  // Fetch and convert movie image
  useEffect(() => {
    const fetchImage = async () => {
      if (booking?.movie?.imageUrl) {
        const base64 = await convertImageToBase64(booking.movie?.imageUrl);
        setBase64Image(base64);
      }
    };
    fetchImage();
  }, [booking]);

  // Save bill to database
  const saveBillToDatabase = async () => {
    if (!booking) {
      console.error("Không có dữ liệu booking để lưu hóa đơn.");
      return;
    }

    const billData = {
      user: {
        name: booking.user?.name || "N/A",
        email: booking.user?.email || "N/A",
        phone: booking.user?.phone || "N/A",
      },
      movie: {
        title: booking.movie?.title || "N/A",
        imageUrl: booking.movie?.imageUrl || "",
        releaseDate: booking.movie?.releaseDate || new Date(),
        genre: booking.movie?.genre || "N/A",
      },
      booking: {
        date: booking.date || new Date(),
        seats: booking.seats || [],
        totalPrice: booking.totalPrice || 0,
        paymentMethod: booking.paymentMethod || "N/A",
      },
    };

    console.log("Dữ liệu hóa đơn gửi đến API:", billData);
    try {
      const response = await fetch("http://localhost:5000/api/bills/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(billData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Hóa đơn đã được lưu vào cơ sở dữ liệu!");
      } else {
        console.error("Lỗi khi lưu hóa đơn:", data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
    }
  };

  const updateAllImageUrls = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/update-image-urls",
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Log kết quả
      } else {
        console.error("Lỗi khi cập nhật imageUrl:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API cập nhật imageUrl:", error);
    }
  };

  // Gọi hàm để cập nhật tất cả imageUrl
  updateAllImageUrls();

  // Generate QR Code
  const generateQRCode = async (billData) => {
    try {
      const qrContent = `Tên: ${billData.user.name}\nTổng tiền: ${billData.booking.totalPrice} VND\nPhương thức: ${billData.booking.paymentMethod}`;
      const qrCodeData = await QRCode.toDataURL(qrContent);
      return qrCodeData;
    } catch (error) {
      console.error("Lỗi khi tạo mã QR:", error);
      return null;
    }
  };

  // Export bill
  const exportBill = async () => {
    if (!booking) {
      console.error("Không có dữ liệu booking để xuất hóa đơn.");
      return;
    }

    // Save bill to database
    await saveBillToDatabase();

    // Generate QR Code
    const qrCodeData = await generateQRCode({
      user: booking.user,
      movie: booking.movie,
      booking: booking,
    });

    // Capture bill as image
    if (billRef.current) {
      html2canvas(billRef.current, { useCORS: true }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "bill.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }

    // Display QR Code (if needed)
    if (qrCodeData) {
      const qrWindow = window.open();
      qrWindow.document.write(`<img src="${qrCodeData}" alt="QR Code" />`);
    }
  };

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }
  // Handle missing booking data
  if (!booking) {
    return (
      <div className="bd-not-found">
        <p>Không tìm thấy thông tin hóa đơn.</p>
        <button className="bd-back-btn" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <HeaderAdmin />
      <button
        className="collapse-button"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <FaBars />
      </button>
      {/* Sidebar */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div className="bd-container">
        <div className="bd-header">
          <h2 className="bd-title">Chi tiết hóa đơn</h2>
          <span className="bd-id">#{bookingId}</span>
        </div>

        <div className="bd-content" ref={billRef}>
          {/* Movie Information */}
          <div className="bd-movie-section">
            <div className="bd-movie-poster">
              <img
                src={booking?.imageUrl}
                alt={booking?.movie?.title || "Không có tiêu đề"}
                className="bd-poster-img"
              />
            </div>
            <div className="bd-movie-details">
              <h3 className="bd-section-title">Thông tin phim</h3>
              <div className="bd-info-item">
                <span className="bd-label">Tên phim:</span>
                <span className="bd-value">
                  {booking.movieTitle || "Không có tiêu đề"}
                </span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Thể loại:</span>
                <span className="bd-value">
                  {booking.movie?.genre || "Không có thể loại"}
                </span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Ngày phát hành:</span>
                <span className="bd-value">
                  {moment(booking.movie?.releaseDate).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
          </div>

          {/* Booking and User Information */}
          <div className="bd-booking-section">
            <div className="bd-user-info">
              <h3 className="bd-section-title">Thông tin người dùng</h3>
              <div className="bd-info-item">
                <span className="bd-label">Tên:</span>
                <span className="bd-value">
                  {booking.user?.name || "Không có tên"}
                </span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Email:</span>
                <span className="bd-value">
                  {booking.user?.email || "Không có email"}
                </span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Số điện thoại:</span>
                <span className="bd-value">
                  {booking.user?.phone || "Không có số điện thoại"}
                </span>
              </div>
            </div>

            <div className="bd-reservation-info">
              <h3 className="bd-section-title">Thông tin đặt vé</h3>
              <div className="bd-info-item">
                <span className="bd-label">Ngày chiếu:</span>
                <span className="bd-value">
                  {moment(booking.booking?.date).format("DD/MM/YYYY")}
                </span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Ghế:</span>
                <span className="bd-value">
                  {booking.seats.join(", ") || "Không có ghế"}
                </span>
              </div>
            </div>

            <div className="bd-payment-info">
              <h3 className="bd-section-title">Thông tin thanh toán</h3>
              <div className="bd-info-item">
                <span className="bd-label">Tổng tiền:</span>
                <span className="bd-value bd-price">
                  {booking.totalPrice.toLocaleString() || "0"} VND
                </span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Phương thức thanh toán:</span>
                <span className="bd-value">
                  {booking.paymentMethod || "Không có phương thức"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bd-footer">
          <button className="bd-back-btn" onClick={() => navigate(-1)}>
            Quay lại
          </button>
          <button className="bd-save-btn" onClick={exportBill}>
            Xuất hóa đơn
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
