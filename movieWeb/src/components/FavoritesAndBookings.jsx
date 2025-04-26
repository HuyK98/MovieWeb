import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import "../styles/FavoritesAndBookings.css";
import axios from "axios";
import API_URL from "../api/config"; // Đường dẫn đến tệp apiUrl.js

const FavoritesAndBookings = ({
  favorites,
  showFavorites,
  setShowFavorites,
  handleRemoveFavorite,
  updateTotalNotifications,
}) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [momoBills, setMomoBills] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [readItems, setReadItems] = useState(() => {
    const savedReadItems = JSON.parse(localStorage.getItem("readItems")) || [];
    return savedReadItems;
  });

  // Cập nhật useEffect để tính tổng số lượng thông báo
  useEffect(() => {
    // Tính tổng số lượng
    const totalNotifications =
      favorites.length + userBookings.length + momoBills.length;

    // Truyền tổng số lượng lên component cha
    if (typeof updateTotalNotifications === "function") {
      updateTotalNotifications(totalNotifications);
    }
  }, [favorites, userBookings, momoBills, updateTotalNotifications]);

  const handleRemoveFromList = (id, type) => {
    const deletedItems = JSON.parse(localStorage.getItem("deletedItems")) || [];
    deletedItems.push(id);
    localStorage.setItem("deletedItems", JSON.stringify(deletedItems));

    if (type === "cash") {
      setUserBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== id)
      );
    } else if (type === "momo") {
      setMomoBills((prevBills) =>
        prevBills.filter((booking) => booking._id !== id)
      );
    } else if (type === "favorite") {
      handleRemoveFavorite(id);
    }

    // Cập nhật tổng số lượng sau khi xóa
    const totalNotifications =
      favorites.length + userBookings.length + momoBills.length - 1;
    updateTotalNotifications(totalNotifications);
  };

  useEffect(() => {
    // Lấy danh sách đã đọc từ localStorage khi component được mount
    const savedReadItems = JSON.parse(localStorage.getItem("readItems")) || [];
    setReadItems(savedReadItems);

    // Tính toán lại số lượng tổng
    const totalNotifications =
      favorites.length +
      userBookings.length +
      momoBills.length -
      savedReadItems.length;

    if (typeof updateTotalNotifications === "function") {
      updateTotalNotifications(totalNotifications);
    }
  }, [favorites, userBookings, momoBills, updateTotalNotifications]);

  // Lấy thông tin người dùng từ localStorage khi component được mount
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // console.log("Thông tin người dùng hiện tại từ localStorage:", userInfo);

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
          const deletedItems =
            JSON.parse(localStorage.getItem("deletedItems")) || [];

          // Fetch bookings with "cash" payment method
          const cashResponse = await axios.get(
            `${API_URL}/api/bookings`,
            {
              params: {
                userId: currentUser._id,
                paymentMethod: "cash",
              },
            }
          );

          // Loại bỏ các mục đã bị xóa
          const filteredCashBookings = cashResponse.data.filter(
            (booking) => !deletedItems.includes(booking._id)
          );

          // Fetch bookings with "momo" payment method
          const momoResponse = await axios.get(
            `${API_URL}/api/bookings`,
            {
              params: {
                userId: currentUser._id,
                paymentMethod: "momo",
              },
            }
          );

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

  const handleMarkAsRead = (id, type) => {
    // Nếu mục đã được đánh dấu là đã đọc, không làm gì
    if (readItems.includes(id)) return;

    // Thêm ID vào danh sách các mục đã đọc
    const updatedReadItems = [...readItems, id];
    setReadItems(updatedReadItems);

    // Lưu danh sách đã đọc vào localStorage
    localStorage.setItem("readItems", JSON.stringify(updatedReadItems));

    // Tính toán số lượng tổng mới
    const totalNotifications =
      favorites.length +
      userBookings.length +
      momoBills.length -
      updatedReadItems.length;

    // Cập nhật tổng số lượng thông báo
    if (typeof updateTotalNotifications === "function") {
      updateTotalNotifications(totalNotifications);
    }

    console.log(`Đánh dấu ${type} với ID ${id} là đã đọc`);
  };

  return (
    <div>
      {/* Hiển thị danh sách yêu thích và hóa đơn */}
      {showFavorites && (
        <div
          className="favorites-overlay"
          onClick={() => setShowFavorites(false)}
        >
          <div className="favorites-list" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-favorites"
              onClick={() => setShowFavorites(false)}
            >
              X
            </button>
            <h2>THÔNG BÁO</h2>

            {/* Hiển thị danh sách yêu thích */}
            {favorites.length > 0 ? (
              <div className="favorites-grid">
                {favorites.map((movie) => (
                  <div
                    key={movie._id}
                    className={`favorite-item ${
                      readItems.includes(movie._id) ? "read" : ""
                    }`}
                  >
                    <div className="favorite-image-container">
                      <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="favorite-image"
                        onClick={() => handleMarkAsRead(movie._id, "favorite")}
                      />
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
                <div
                  key={booking._id}
                  className={`favorite-item ${
                    readItems.includes(booking._id) ? "read" : ""
                  }`}
                >
                  <div className="favorite-image-container">
                    <img
                      src={booking.imageUrl}
                      className="favorite-image"
                      onClick={() => handleMarkAsRead(booking._id, "cash")}
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
                            onClick={() =>
                              handleMarkAsRead(booking._id, "cash")
                            }
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
                    <p>
                      Ngày chiếu:{" "}
                      {booking.date
                        ? moment(booking.date).format("DD/MM/YYYY")
                        : "Không có ngày chiếu"}
                    </p>
                    <p>
                      Ghế:{" "}
                      {Array.isArray(booking.seats)
                        ? booking.seats.join(", ")
                        : "Không có thông tin ghế"}
                    </p>
                    <p>
                      <strong>Phương thức:</strong> Tiền mặt
                    </p>
                    <p>
                      <strong>Tổng tiền:</strong>{" "}
                      {booking.totalPrice
                        ? booking.totalPrice.toLocaleString()
                        : "0"}{" "}
                      VND
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có bookings nào thanh toán bằng Tiền mặt.</p>
            )}

            {/* Hiển thị danh sách hóa đơn MOMO */}
            {momoBills.length > 0 ? (
              momoBills.map((booking, index) => (
                <div
                  key={booking._id}
                  className={`favorite-item ${
                    readItems.includes(booking._id) ? "read" : ""
                  }`}
                >
                  <div className="favorite-image-container">
                    <img
                      src={booking.imageUrl}
                      className="favorite-image"
                      onClick={() => handleMarkAsRead(booking._id, "momo")}
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
                            onClick={() => handleOpenModal(booking._id, "momo")}
                          >
                            Xóa khỏi danh sách
                          </button>
                          <button
                            className="menu-item-favorite"
                            onClick={() =>
                              handleMarkAsRead(booking._id, "momo")
                            }
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
                    <p>
                      Ngày chiếu:{" "}
                      {booking.date
                        ? moment(booking.date).format("DD/MM/YYYY")
                        : "Không có ngày chiếu"}
                    </p>
                    <p>
                      Ghế:{" "}
                      {Array.isArray(booking.seats)
                        ? booking.seats.join(", ")
                        : "Không có thông tin ghế"}
                    </p>
                    <p>
                      <strong>Phương thức:</strong> momo
                    </p>
                    <p>
                      <strong>Tổng tiền:</strong>{" "}
                      {booking.totalPrice
                        ? booking.totalPrice.toLocaleString()
                        : "0"}{" "}
                      VND
                    </p>
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