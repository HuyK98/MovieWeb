import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "../styles/FavoritesAndBookings.css";
import axios from "axios";

const FavoritesAndBookings = ({
  favorites,
  showFavorites,
  setShowFavorites,
  handleRemoveFavorite,
}) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [momoBills, setMomoBills] = useState([]);
  const [allBills, setAllBills] = useState([]);

  // Lấy thông tin người dùng từ localStorage khi component được mount
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("Thông tin người dùng hiện tại từ localStorage:", userInfo);

    if (!userInfo) {
      navigate("/login"); // Chuyển hướng đến trang đăng nhập nếu không có thông tin người dùng
    } else {
      setCurrentUser(userInfo); // Cập nhật state nếu có thông tin người dùng
      sessionStorage.setItem("sessionActive", "true"); // Đánh dấu phiên làm việc đang hoạt động
    }
  }, [navigate]);

  // Xóa thông tin người dùng khi đóng trình duyệt
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Kiểm tra nếu người dùng đóng trình duyệt (không phải reload)
      if (!sessionStorage.getItem("sessionActive")) {
        localStorage.removeItem("userInfo");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Xóa thông tin người dùng khỏi localStorage
    sessionStorage.removeItem("sessionActive");
    setCurrentUser(null); // Đặt lại state
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  // Cập nhật useEffect để fetch tất cả hóa đơn
  useEffect(() => {
    const fetchAllBills = async () => {
      if (currentUser) {
        try {
          // Lấy tất cả hóa đơn của người dùng
          const allBillsResponse = await axios.get("http://localhost:5000/api/bills", {
            params: {
              name: currentUser.name,
            }
          });

          // Lọc hóa đơn MOMO và hóa đơn khác
          const bills = allBillsResponse.data;
          const momoPayments = bills.filter(bill => bill.booking.paymentMethod === 'momo');
          const otherPayments = bills.filter(bill => bill.booking.paymentMethod !== 'momo');

          setUserBookings(otherPayments);
          setMomoBills(momoPayments);

          console.log("Hóa đơn MOMO:", momoPayments);
          console.log("Hóa đơn khác:", otherPayments);

        } catch (error) {
          console.error("Lỗi khi lấy danh sách hóa đơn:", error);
        }
      }
    };

    fetchAllBills();
  }, [currentUser]);
  

  return (
    <div>
      {/* Hiển thị danh sách yêu thích và hóa đơn */}
      {showFavorites && (
        <div className="favorites-overlay" onClick={() => setShowFavorites(false)}>
          <div className="favorites-list" onClick={(e) => e.stopPropagation()}>
            <button className="close-favorites" onClick={() => setShowFavorites(false)}>
              X
            </button>
            <h2>THÔNG BÁO</h2>

            {/* Hiển thị danh sách yêu thích */}
            {favorites.length > 0 ? (
              <div className="favorites-grid">
                {favorites.map((movie) => (
                  <div key={movie._id} className="favorite-item">
                    <div className="favorite-image-container">
                      <img src={movie.imageUrl} alt={movie.title} className="favorite-image" />
                      <div className="favorite-icon">
                        <FontAwesomeIcon icon={faHeart} />
                      </div>
                      <button
                        className="favorite-remove-button"
                        onClick={() => handleRemoveFavorite(movie._id)}
                      >
                        -
                      </button>
                    </div>
                    <div className="favorite-title">
                      <h3
                        className="movie-title-link"
                        onClick={() => navigate(`/movie/${movie._id}`)}
                      >
                        {movie.title}
                      </h3>
                      <p>Thể Loại: {movie.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Không có phim nào trong danh sách yêu thích.</p>
            )}

            {/* Hiển thị danh sách hóa đơn */}
            {userBookings.length > 0 ? (
              userBookings.map((booking, index) => (
                <div key={index} className="favorite-item">
                  <div className="favorite-image-container">
                    <img
                      src={booking.movie.imageUrl}
                      alt={booking.movie.title}
                      className="favorite-image"
                    />
                    <div className="bill-icon">
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                  </div>
                  <div className="favorite-title">
                    <h3
                      className="movie-title-link"
                      onClick={() => navigate(`/booking/${index}`)}
                    >
                      {booking.movie.title}
                    </h3>
                    <p>Ngày chiếu: {moment(booking.booking.date).format("DD/MM/YYYY")}</p>
                    <p>Ghế: {booking.booking.seats.join(", ")}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có hóa đơn nào.</p>
            )}

            {/* Hiển thị danh sách hóa đơn MOMO */}
            {momoBills.length > 0 ? (
              momoBills.map((booking, index) => (
                <div key={index} className="favorite-item">
                  <div className="favorite-image-container">
                    <img
                      src={booking.movie.imageUrl}
                      alt={booking.movie.title}
                      className="favorite-image"
                    />
                    <div className="bill-icon">
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                  </div>
                  <div className="favorite-title">
                    <h3
                      className="movie-title-link"
                      onClick={() => navigate(`/booking/${index}?paymentMethod=${booking.booking.paymentMethod}`)}
                    >
                      {booking.movie.title}
                    </h3>
                    <p>Ngày chiếu: {moment(booking.booking.date).format("DD/MM/YYYY")}</p>
                    <p>Ghế: {booking.booking.seats.join(", ")}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có hóa đơn nào thanh toán bằng MOMO.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesAndBookings;