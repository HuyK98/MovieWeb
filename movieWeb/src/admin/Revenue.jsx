import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Legend,
} from "chart.js";
import "../styles/Revenue.css";
import { Link } from "react-router-dom";
import {
  FaCogs,
  FaFilm,
  FaUser,
  FaTicketAlt,
  FaSignOutAlt,
  FaChartLine,
  FaBars,
} from "react-icons/fa";
import {
  MdRemoveRedEye,
  MdOutlineAddCircle,
  MdTheaters,
  MdSchedule,
  MdCategory,
} from "react-icons/md";
import logo from "../assets/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// Đăng ký các thành phần cần thiết của Chart.js
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Legend
);
import API_URL from "../api/config"; // Import API_URL từ file config.js

const Revenue = () => {
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [selectedChart, setSelectedChart] = useState("daily"); // State để lưu biểu đồ được chọn
  const [error, setError] = useState(null);
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State để quản lý trạng thái collapse

  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // Lưu tháng được chọn
  const [searchTerm, setSearchTerm] = useState(""); // Lưu từ khóa tìm kiếm

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/payment/summary`
        );
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching revenue summary:", error);
        setError("Không thể tải dữ liệu doanh thu.");
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/payment/transactions`
        );
        setTransactions(response.data);

        // Tự động chọn tháng hiện tại khi load trang
        const currentMonth = new Date().getMonth() + 1;
        setSelectedMonth(currentMonth.toString());

        // Lọc dữ liệu theo tháng hiện tại
        const filtered = response.data.filter((transaction) => {
          const month = new Date(transaction.date).getMonth() + 1;
          return month === currentMonth;
        });
        setFilteredTransactions(filtered);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Không thể tải dữ liệu giao dịch.");
      }
    };

    const fetchDailyRevenue = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/payment/daily`
        );
        setDailyRevenue(response.data);
      } catch (error) {
        console.error("Error fetching daily revenue:", error);
        setError("Không thể tải dữ liệu doanh thu theo ngày.");
      }
    };

    const fetchWeeklyRevenue = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/payment/weekly`
        );
        setWeeklyRevenue(response.data);
      } catch (error) {
        console.error("Error fetching weekly revenue:", error);
        setError("Không thể tải dữ liệu doanh thu theo tuần.");
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/payment/monthly`
        );
        setMonthlyRevenue(response.data);
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        setError("Không thể tải dữ liệu doanh thu theo tháng.");
      }
    };
    const fetchRevenueByMovie = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/payment/by-movie`
        );
        setRevenueByMovie(response.data);
      } catch (error) {
        console.error("Error fetching revenue by movie:", error);
        setError("Không thể tải dữ liệu doanh thu theo phim.");
      }
    };

    fetchSummary();
    fetchTransactions();
    fetchWeeklyRevenue();
    fetchMonthlyRevenue();
    fetchDailyRevenue();
    fetchRevenueByMovie();
  }, []);


  const dailyData = {
    labels: dailyRevenue.map((item) => item._id),
    datasets: [
      {
        type: "bar", // Bar Chart
        label: "Doanh thu theo ngày (Bar)",
        data: dailyRevenue.map((item) => item.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        type: "line", // Line Chart
        label: "Doanh thu theo ngày (Line)",
        data: dailyRevenue.map((item) => item.total),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.4, // Làm mịn đường
        pointRadius: 3, // Kích thước điểm
      },
    ],
  };

  const weeklyData = {
    labels: weeklyRevenue.map((item) => `Tuần ${item._id}`),
    datasets: [
      {
        type: "bar",
        label: "Doanh thu theo tuần (Bar)",
        data: weeklyRevenue.map((item) => item.total),
        backgroundColor: "rgba(234, 79, 192, 0.6)",
        borderColor: "rgba(234, 79, 192, 1)",
        borderWidth: 1,
      },
      {
        type: "line",
        label: "Doanh thu theo tuần (Line)",
        data: weeklyRevenue.map((item) => item.total),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const monthlyData = {
    labels: monthlyRevenue.map((item) => `Tháng ${item._id}`),
    datasets: [
      {
        type: "bar",
        label: "Doanh thu theo tháng (Bar)",
        data: monthlyRevenue.map((item) => item.total),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        type: "line",
        label: "Doanh thu theo tháng (Line)",
        data: monthlyRevenue.map((item) => item.total),
        borderColor: "rgba(255, 206, 86, 1)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const movieData = {
    labels: revenueByMovie.map((item) => item._id),
    datasets: [
      {
        type: "bar",
        label: "Doanh thu theo phim (Bar)",
        data: revenueByMovie.map((item) => item.total),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        type: "line",
        label: "Doanh thu theo phim (Line)",
        data: revenueByMovie.map((item) => item.total),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  //định ngày theo ngày Việt NamNam
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Phân loại giao dịch theo tháng
  const groupTransactionsByMonth = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).getMonth() + 1; // Lấy tháng (1-12)
      if (!acc[month]) acc[month] = [];
      acc[month].push(transaction);
      return acc;
    }, {});
  };

  const transactionsByMonth = groupTransactionsByMonth(transactions);

  // Lọc giao dịch theo tháng và từ khóa tìm kiếm
  useEffect(() => {
    let filtered = transactions;

    // Lọc theo tháng
    if (selectedMonth) {
      filtered = transactions.filter((transaction) => {
        const month = new Date(transaction.date).getMonth() + 1;
        return month === parseInt(selectedMonth);
      });
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((transaction) => {
        const searchString = `
          ${transaction.user.name} 
          ${transaction.user.email} 
          ${transaction.movieTitle} 
          ${transaction.cinema} 
          ${transaction.date} 
          ${transaction.time} 
          ${transaction.seats.join(", ")}
        `.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
      });
    }

    setFilteredTransactions(filtered);
  }, [selectedMonth, searchTerm, transactions]);

  return (
    <div className={`admin-dashboard ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
          <button
            className="collapse-button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <FaBars />
          </button>
        </div>

        <ul className="menu">
          <li>
            <Link
              to="/admin"
              className={`menu-item ${
                location.pathname === "/admin" ? "active" : ""
              }`}
            >
              <FaCogs className="icon" />
              {!isSidebarCollapsed && "General"}
            </Link>
          </li>

          <li>
            <div
              onClick={() => setIsMoviesOpen(!isMoviesOpen)}
              className={`menu-item ${isMoviesOpen ? "active" : ""}`}
            >
              <FaFilm className="icon" />
              {!isSidebarCollapsed &&
                `Quản lý phim ${isMoviesOpen ? "▲" : "▼"}`}
            </div>
            {isMoviesOpen && (
              <ul className="submenu">
                <li>
                  <Link
                    to="/admin/movies"
                    className={`submenu-item ${
                      location.pathname === "/admin/movies" ? "active" : ""
                    }`}
                  >
                    <MdRemoveRedEye className="icon-sub" />
                    {!isSidebarCollapsed && "Danh sách phim"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/add-movie"
                    className={`submenu-item ${
                      location.pathname === "/admin/add-movie" ? "active" : ""
                    }`}
                  >
                    <MdOutlineAddCircle className="icon-sub" />
                    {!isSidebarCollapsed && "Thêm phim"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/movie-detail"
                    className={`submenu-item ${
                      location.pathname === "/admin/movie-detail"
                        ? "active"
                        : ""
                    }`}
                  >
                    <MdTheaters className="icon-sub" />
                    {!isSidebarCollapsed && "Xem chi tiết phim"}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/chat"
                    className={`submenu-item ${
                      location.pathname === "/admin/chat" ? "active" : ""
                    }`}
                  >
                    <FaUser className="icon" />
                    {!isSidebarCollapsed && "Chat với người dùng"}
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              to="/admin/schedules"
              className={`menu-item ${
                location.pathname === "/admin/schedules" ? "active" : ""
              }`}
            >
              <MdSchedule className="icon" />
              {!isSidebarCollapsed && "Quản lý lịch chiếu"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/genres"
              className={`menu-item ${
                location.pathname === "/admin/genres" ? "active" : ""
              }`}
            >
              <MdCategory className="icon" />
              {!isSidebarCollapsed && "Quản lý thể loại phim"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`menu-item ${
                location.pathname === "/admin/users" ? "active" : ""
              }`}
            >
              <FaUser className="icon" />
              {!isSidebarCollapsed && "Quản lý người dùng"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/tickets"
              className={`menu-item ${
                location.pathname === "/admin/tickets" ? "active" : ""
              }`}
            >
              <FaTicketAlt className="icon" />
              {!isSidebarCollapsed && "Quản lý vé"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/bills"
              className={`menu-item ${
                location.pathname === "/admin/bills" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="icon" />
              {!isSidebarCollapsed && "Quản lý hóa đơn"}
            </Link>
          </li>
          <li>
            <Link
              to="/admin/revenue"
              className={`menu-item ${
                location.pathname === "/admin/revenue" ? "active" : ""
              }`}
            >
              <FaChartLine className="icon" />
              {!isSidebarCollapsed && "Quản lý doanh thu"}
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className={`menu-item logout ${
                location.pathname === "/logout" ? "active" : ""
              }`}
            >
              <FaSignOutAlt className="icon" />
              {!isSidebarCollapsed && "Đăng xuất"}
            </Link>
          </li>
        </ul>
      </aside>
      <div className="revenue-container">
        <h1>Quản Lý Doanh Thu</h1>
        {error && <p className="error">{error}</p>}
        <div className="summary">
          <h2>Tổng Quan</h2>
          <p>
            Tổng Doanh Thu: {summary.totalRevenue?.toLocaleString("vi-VN")} VND
          </p>{" "}
          <p>Số Lượng Vé Bán Ra: {summary.totalTickets}</p>
          <h3>Doanh Thu Theo Phim</h3>
          <ul>
            {summary.revenueByMovie &&
              summary.revenueByMovie.map((item) => (
                <li key={item._id}>
                  {item._id}: {item.total?.toLocaleString("vi-VN")} VND
                </li>
              ))}
          </ul>
          <h3>Doanh Thu Theo Rạp</h3>
          <ul>
            {summary.revenueByCinema &&
              summary.revenueByCinema.map((item) => (
                <li key={item._id}>
                  {item.total?.toLocaleString("vi-VN")} VND
                </li>
              ))}
          </ul>
          <h3>Doanh Thu Theo Ngày</h3>
          <ul>
            {summary.revenueByDate &&
              summary.revenueByDate.map((item) => (
                <li key={item._id}>
                  {formatDate(item._id)}: {item.total?.toLocaleString("vi-VN")}{" "}
                  VND
                </li>
              ))}
          </ul>
        </div>

        {/* Dropdown menu để chọn biểu đồ */}
        <div className="chart-dropdown">
          <label htmlFor="chart-select">Chọn Biểu Đồ:</label>
          <select
            id="chart-select"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
          >
            <option value="daily">Doanh Thu Theo Ngày</option>
            <option value="weekly">Doanh Thu Theo Tuần</option>
            <option value="monthly">Doanh Thu Theo Tháng</option>
            <option value="movie">Doanh Thu Theo Phim</option>
          </select>
        </div>

        {/* Hiển thị biểu đồ dựa trên lựa chọn */}
        <div className="chart">
          <h2>Biểu Đồ Doanh Thu</h2>
          {selectedChart === "daily" && (
            <Bar
              data={dailyData}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    labels: { color: "rgba(75, 192, 192, 1)" },
                  },
                },
              }}
            />
          )}
          {selectedChart === "weekly" && (
            <Bar
              data={weeklyData}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    labels: { color: "rgba(75, 192, 192, 1)" },
                  },
                },
              }}
            />
          )}
          {selectedChart === "monthly" && (

            <Bar
              data={monthlyData}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    labels: { color: "rgba(153, 102, 255, 1)" },
                  },
                },
              }}
            />
          )}
          {selectedChart === "movie" && (

            <Bar
              data={movieData}
              options={{
                plugins: {
                  legend: {
                    display: true,
                    labels: { color: "rgba(255, 159, 64, 1)" },
                  },
                },
              }}
            />
          )}

        </div>

        <div className="transactions">
          <h2>Chi Tiết Giao Dịch</h2>
          {/* Bộ lọc tháng */}
          <div className="filters">
            <label htmlFor="month-select">Chọn Tháng:</label>
            <select
              id="month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {/* <option value="">Tất cả</option> */}
              {[...Array(12).keys()].map((month) => (
                <option key={month + 1} value={month + 1}>
                  Tháng {month + 1}
                </option>
              ))}
            </select>

            {/* Ô tìm kiếm */}
            <label htmlFor="search-input">Tìm Kiếm:</label>
            <input
              id="search-input"
              type="text"
              placeholder="Nhập tên, email, phim, rạp, ngày, giờ, ghế..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <table>
            <thead>
              <tr>
                <th className="col-stt">STT</th>
                <th className="col-user">Người Dùng</th>
                <th className="col-email">Email</th>
                <th className="col-movie">Phim</th>
                <th className="col-cinema">Rạp</th>
                <th className="col-date">Ngày</th>
                <th className="col-time">Giờ</th>
                <th className="col-seats">Ghế</th>
                <th className="col-total">Tổng Tiền</th>
                <th className="col-payment">Phương Thức Thanh Toán</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={transaction._id}>
                  <td className="col-stt">
                    {transactions.indexOf(transaction) + 1}
                  </td>
                  <td className="col-user">{transaction.user.name}</td>
                  <td className="col-email">{transaction.user.email}</td>
                  <td className="col-movie">{transaction.movieTitle}</td>
                  <td className="col-cinema">{transaction.cinema}</td>
                  <td className="col-date">{formatDate(transaction.date)}</td>
                  <td className="col-time">{transaction.time}</td>
                  <td className="col-seats">{transaction.seats.join(", ")}</td>
                  <td className="col-total">
                    {transaction.totalPrice?.toLocaleString("vi-VN")} VND
                  </td>
                  <td className="col-payment">{transaction.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
