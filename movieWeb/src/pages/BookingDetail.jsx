import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import "../styles/BookingDetail.css";

const BookingDetail = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const booking = bookings[bookingId];
  const billRef = useRef(null);
  const [base64Image, setBase64Image] = useState('');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const saveBillToDatabase = async () => {
    const billData = {
      user: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
      movie: {
        title: booking.movie.title,
        imageUrl: booking.movie.imageUrl,
        releaseDate: booking.movie.releaseDate || new Date(),
        genre: booking.movie.genre,
      },
      booking: {
        date: booking.booking.date,
        seats: booking.booking.seats,
        totalPrice: booking.booking.totalPrice,
        paymentMethod: booking.booking.paymentMethod,
      },
    };

    console.log("Dữ liệu hóa đơn gửi đến API:", billData);
    try {
      const response = await fetch('http://localhost:5000/api/bills/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(billData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Hóa đơn đã được lưu vào cơ sở dữ liệu!');
      } else {
        console.error('Lỗi khi lưu hóa đơn:', data.message);
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
    }
  };

  const generateQRCode = async (billData) => {
    try {
      const qrContent = `Tên: ${billData.user.name}\nTổng tiền: ${billData.booking.totalPrice} VND\nPhương thức: ${billData.booking.paymentMethod}`;
      const qrCodeData = await QRCode.toDataURL(qrContent);
      return qrCodeData;
    } catch (error) {
      console.error('Lỗi khi tạo mã QR:', error);
      return null;
    }
  };

  const exportBill = async () => {
    // Lưu hóa đơn vào cơ sở dữ liệu
    await saveBillToDatabase();

    // Tạo mã QR với URL hoặc thông tin cụ thể
    const qrCodeData = await generateQRCode({
      user: booking.user,
      movie: booking.movie,
      booking: booking.booking,
    });

    // Chụp ảnh hóa đơn
    if (billRef.current) {
      html2canvas(billRef.current, { useCORS: true }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'bill.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }

    // Hiển thị mã QR (nếu cần)
    if (qrCodeData) {
      const qrWindow = window.open();
      qrWindow.document.write(`<img src="${qrCodeData}" alt="QR Code" />`);
    }
  };

  if (!booking) {
    return (
      <div className="bd-not-found">
        <p>Không tìm thấy thông tin hóa đơn.</p>
        <button className="bd-back-btn" onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const convertImageToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    const fetchImage = async () => {
      const base64 = await convertImageToBase64(booking.movie.imageUrl);
      setBase64Image(base64);
    };
    fetchImage();
  }, [booking.movie.imageUrl]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Thêm useEffect để cuộn trang khi người dùng cuộn
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

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  return (
    <><Header
      user={user}
      handleLogout={handleLogout}
      searchTerm={searchTerm}
      handleSearchChange={handleSearchChange}
      favorites={favorites}
      toggleFavorites={() => setShowFavorites(!showFavorites)}
      showFavorites={showFavorites}
      isScrolled={isScrolled} /><div className="bd-container">
        <div className="bd-header">
          <h2 className="bd-title">Chi tiết hóa đơn</h2>
          <span className="bd-id">#{bookingId}</span>
        </div>

        <div className="bd-content" ref={billRef}>
          {/* Thông tin phim - Cột trái */}
          <div className="bd-movie-section">
            <div className="bd-movie-poster">
              {base64Image ? (
                <img
                  src={base64Image}
                  alt={booking.movie.title}
                  className="bd-poster-img" />
              ) : (
                <p>Đang tải hình ảnh...</p>
              )}
            </div>

            <div className="bd-movie-details">
              <h3 className="bd-section-title">Thông tin phim</h3>
              <div className="bd-info-item">
                <span className="bd-label">Tên phim:</span>
                <span className="bd-value">{booking.movie.title}</span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Thể loại:</span>
                <span className="bd-value">{booking.movie.genre}</span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Ngày phát hành:</span>
                <span className="bd-value">{moment(booking.movie.releaseDate).format('DD/MM/YYYY')}</span>
              </div>
            </div>
          </div>

          {/* Thông tin đặt vé và người dùng - Cột phải */}
          <div className="bd-booking-section">
            <div className="bd-user-info">
              <h3 className="bd-section-title">Thông tin người dùng</h3>
              <div className="bd-info-item">
                <span className="bd-label">Tên:</span>
                <span className="bd-value">{booking.user.name}</span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Email:</span>
                <span className="bd-value">{booking.user.email}</span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Số điện thoại:</span>
                <span className="bd-value">{booking.user.phone}</span>
              </div>
            </div>

            <div className="bd-reservation-info">
              <h3 className="bd-section-title">Thông tin đặt vé</h3>
              <div className="bd-info-item">
                <span className="bd-label">Ngày chiếu:</span>
                <span className="bd-value">{moment(booking.booking.date).format('DD/MM/YYYY')}</span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Ghế:</span>
                <span className="bd-value">{booking.booking.seats.join(', ')}</span>
              </div>
            </div>

            <div className="bd-payment-info">
              <h3 className="bd-section-title">Thông tin thanh toán</h3>
              <div className="bd-info-item">
                <span className="bd-label">Tổng tiền:</span>
                <span className="bd-value bd-price">{booking.booking.totalPrice.toLocaleString()} VND</span>
              </div>
              <div className="bd-info-item">
                <span className="bd-label">Phương thức thanh toán:</span>
                <span className="bd-value">{booking.booking.paymentMethod}</span>
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
      <Footer toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
    </>
  );
};

export default BookingDetail;