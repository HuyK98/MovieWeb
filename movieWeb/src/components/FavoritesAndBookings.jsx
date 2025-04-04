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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);

  // Lấy thông tin người dùng từ localStorage khi component được mount
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("Thông tin người dùng hiện tại từ localStorage:", userInfo);

    if (!userInfo) {
      navigate("/login");
    } else {
      setCurrentUser(userInfo);
      sessionStorage.setItem("sessionActive", "true");
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
    const fetchAllBookings = async () => {
      if (currentUser) {
        try {
          const deletedItems = JSON.parse(localStorage.getItem("deletedItems")) || [];

          // Fetch bookings with "cash" payment method
          const cashResponse = await axios.get("http://localhost:5000/api/bookings", {
            params: {
              userId: currentUser._id,
              paymentMethod: "cash",
            },
          });

          // Loại bỏ các mục đã bị xóa
          const filteredCashBookings = cashResponse.data.filter(
            (booking) => !deletedItems.includes(booking._id)
          );

          // Fetch bookings with "momo" payment method
          const momoResponse = await axios.get("http://localhost:5000/api/bookings", {
            params: {
              userId: currentUser._id,
              paymentMethod: "momo",
            },
          });

          // Loại bỏ các mục đã bị xóa
          const filteredMomoBookings = momoResponse.data.filter(
            (booking) => !deletedItems.includes(booking._id)
          );

          // Save bookings to state
          setUserBookings(filteredCashBookings);
          setMomoBills(filteredMomoBookings);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách bookings:", error);
        }
      }
    };

    fetchAllBookings();
  }, [currentUser]);

  // Hàm xử lý xóa hóa đơn khỏi danh sách
  const handleRemoveFromList = (id, type) => {
    // Lưu ID của mục đã xóa vào localStorage
    const deletedItems = JSON.parse(localStorage.getItem("deletedItems")) || [];
    deletedItems.push(id);
    localStorage.setItem("deletedItems", JSON.stringify(deletedItems));

    // Xóa mục khỏi danh sách hiển thị
    if (type === "cash") {
      setUserBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== id)
      );
    } else if (type === "momo") {
      setMomoBills((prevBills) =>
        prevBills.filter((booking) => booking._id !== id)
      );
    }
  };

  const handleToggleMenu = (id) => {
    setSelectedMenu((prev) => (prev === id ? null : id));
  };

  const handleOpenModal = (id, type) => {
    setSelectedBooking(id);
    setSelectedType(type);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    handleRemoveFromList(selectedBooking, selectedType);
    setShowConfirmModal(false);
  };

  const handleMarkAsRead = (id) => {
    // Thêm logic để đánh dấu là đã đọc
    console.log(`Đánh dấu booking ${id} là đã đọc`);
    setSelectedMenu(null);
  };

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
                      <p>Thể Loại: {movie?.genre}</p>
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
                <div key={booking._id} className="favorite-item">
                  <div className="favorite-image-container">
                    <img
                      src={booking.imageUrl}
                      className="favorite-image"
                    />
                    <div className="bill-icon">
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                    {/* Nút "..." */}
                    <div className="menu-icon">
                      <button
                        className="menu-button"
                        onClick={() => handleToggleMenu(booking._id)}
                      >
                        ...
                      </button>
                      {selectedMenu === booking._id && (
                        <div className="menu-list">
                          <button
                            className="menu-item-favorite"
                            onClick={() => handleOpenModal(booking._id, "cash")}
                          >
                            Xóa khỏi danh sách
                          </button>
                          <button
                            className="menu-item-favorite"
                            onClick={() => handleMarkAsRead(booking._id)}
                          >
                            Đánh dấu là đã đọc
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="favorite-title">
                    <h3
                      className="movie-title-link"
                      onClick={() => navigate(`/booking/${booking._id}`)}
                    >
                      {booking.movieTitle}
                    </h3>
                    <p>Ngày chiếu: {booking.date ? moment(booking.date).format("DD/MM/YYYY") : "Không có ngày chiếu"}</p>
                    <p>Ghế: {Array.isArray(booking.seats) ? booking.seats.join(", ") : "Không có thông tin ghế"}</p>
                    <p><strong>Phương thức:</strong> Tiền mặt</p>
                    <p><strong>Tổng tiền:</strong> {booking.totalPrice ? booking.totalPrice.toLocaleString() : "0"} VND</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có bookings nào thanh toán bằng Tiền mặt.</p>
            )}

            {/* Hiển thị danh sách hóa đơn MOMO */}
            {momoBills.length > 0 ? (
              momoBills.map((booking, index) => (
                <div key={booking._id} className="favorite-item">
                  <div className="favorite-image-container">
                    <img
                      src={booking.movie?.imageUrl}
                      className="favorite-image"
                    />
                    <div className="bill-icon">
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                    <div className="menu-icon">
                      <button
                        className="menu-button"
                        onClick={() => handleToggleMenu(booking._id)}
                      >
                        ...
                      </button>
                      {selectedMenu === booking._id && (
                        <div className="menu-list">
                          <button
                            className="menu-item-favorite"
                            onClick={() => handleOpenModal(booking._id, "cash")}
                          >
                            Xóa khỏi danh sách
                          </button>
                          <button
                            className="menu-item-favorite"
                            onClick={() => handleMarkAsRead(booking._id)}
                          >
                            Đánh dấu là đã đọc
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="favorite-title">
                    <h3
                      className="movie-title-link"
                      onClick={() => navigate(`/booking/${booking._id}`)}
                    >
                      {booking.movieTitle}
                    </h3>
                    <p>Ngày chiếu: {booking.date ? moment(booking.date).format("DD/MM/YYYY") : "Không có ngày chiếu"}</p>
                    <p>Ghế: {Array.isArray(booking.seats) ? booking.seats.join(", ") : "Không có thông tin ghế"}</p>
                    <p><strong>Phương thức:</strong> MOMO</p>
                    <p><strong>Tổng tiền:</strong> {booking.totalPrice ? booking.totalPrice.toLocaleString() : "0"} VND</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có bookings nào thanh toán bằng MOMO.</p>
            )}
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Bạn có chắc chắn muốn xóa đơn hàng khỏi danh sách không?</p>
            <button onClick={handleConfirmDelete}>OK</button>
            <button onClick={() => setShowConfirmModal(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default FavoritesAndBookings;