import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Legend } from 'chart.js';
import '../styles/Revenue.css';
import { Link } from "react-router-dom";
import { FaCogs, FaFilm, FaUser, FaTicketAlt, FaSignOutAlt, FaChartLine } from "react-icons/fa";
import { MdRemoveRedEye, MdOutlineAddCircle, MdTheaters, MdSchedule, MdCategory } from "react-icons/md";
import logo from "../assets/logo.jpg";

// Đăng ký các thành phần cần thiết của Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Legend);

const Revenue = () => {
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [error, setError] = useState(null);
  const [isMoviesOpen, setIsMoviesOpen] = useState(false);


  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payment/summary');
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching revenue summary:", error);
        setError("Không thể tải dữ liệu doanh thu.");
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payment/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Không thể tải dữ liệu giao dịch.");
      }
    };

    // const fetchDailyRevenue = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:5000/api/revenue/daily');
    //     setDailyRevenue(response.data);
    //   } catch (error) {
    //     console.error("Error fetching daily revenue:", error);
    //     setError("Không thể tải dữ liệu doanh thu theo ngày.");
    //   }
    // };

    // const fetchWeeklyRevenue = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:5000/api/payment/weekly');
    //     setWeeklyRevenue(response.data);
    //   } catch (error) {
    //     console.error("Error fetching weekly revenue:", error);
    //     setError("Không thể tải dữ liệu doanh thu theo tuần.");
    //   }
    // };

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payment/monthly');
        setMonthlyRevenue(response.data);
      } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        setError("Không thể tải dữ liệu doanh thu theo tháng.");
      }
    };
    const fetchRevenueByMovie = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payment/by-movie');
        setRevenueByMovie(response.data);
      } catch (error) {
        console.error("Error fetching revenue by movie:", error);
        setError("Không thể tải dữ liệu doanh thu theo phim.");
      }
    };

    fetchSummary();
    fetchTransactions();
    // fetchWeeklyRevenue();
    fetchMonthlyRevenue();
    // fetchDailyRevenue();
    fetchRevenueByMovie();
  }, []);
  
  // const dailyData = {
  //   labels: dailyRevenue.map(item => item._id),
  //   datasets: [
  //     {
  //       label: 'Doanh thu theo ngày',
  //       data: dailyRevenue.map(item => item.total),
  //       backgroundColor: 'rgba(75, 192, 192, 0.6)',
  //       borderColor: 'rgba(75, 192, 192, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const weeklyData = {
  //   labels: weeklyRevenue.map(item => `Tuần ${item._id}`),
  //   datasets: [
  //     {
  //       label: 'Doanh thu theo tuần',
  //       data: weeklyRevenue.map(item => item.total),
  //       backgroundColor: 'rgba(75, 192, 192, 0.6)',
  //       borderColor: 'rgba(75, 192, 192, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const monthlyData = {
    labels: monthlyRevenue.map(item => `Tháng ${item._id}`),
    datasets: [
      {
        label: 'Doanh thu theo tháng',
        data: monthlyRevenue.map(item => item.total),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const movieData = {
    labels: revenueByMovie.map(item => item._id),
    datasets: [
      {
        label: 'Doanh thu theo phim',
        data: revenueByMovie.map(item => item.total),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        <ul className="menu">
          <li>
            <Link to="/admin" className="menu-item">
              <FaCogs className="icon" /> General
            </Link>
          </li>

          <li>
            <div onClick={() => setIsMoviesOpen(!isMoviesOpen)} className="menu-item">
              <FaFilm className="icon" /> Quản lý phim {isMoviesOpen ? "▲" : "▼"}
            </div>
            {isMoviesOpen && (
              <ul className="submenu">
                <li>
                  <Link to="/admin/movies"><MdRemoveRedEye className="icon-sub" /> Danh sách phim</Link>
                </li>
                <li>
                  <Link to="/admin/add-movie"><MdOutlineAddCircle className="icon-sub" /> Thêm phim</Link>
                </li>
                <li>
                  <Link to="/admin/movie-detail"><MdTheaters className="icon-sub" /> Xem chi tiết phim</Link>
                </li>
              </ul>
            )}
          </li>
          <li><Link to="/admin/schedules" className="menu-item"><MdSchedule className="icon" /> Quản lý lịch chiếu</Link></li>
          <li><Link to="/admin/genres" className="menu-item"><MdCategory className="icon" /> Quản lý thể loại phim</Link></li>
          <li><Link to="/admin/users" className="menu-item"><FaUser className="icon" /> Quản lý người dùng</Link></li>
          <li><Link to="/admin/tickets" className="menu-item"><FaTicketAlt className="icon" /> Quản lý vé</Link></li>
          <li><Link to="/admin/revenue" className="menu-item"><FaChartLine className="icon" /> Quản lý doanh thu</Link></li>
          <li><Link to="/logout" className="menu-item logout"><FaSignOutAlt className="icon" /> Đăng xuất</Link></li>
        </ul>
      </aside>
    <div className="revenue-container">
      <h1>Quản Lý Doanh Thu</h1>
      {error && <p className="error">{error}</p>}
      <div className="summary">
        <h2>Tổng Quan</h2>
        <p>Tổng Doanh Thu: {summary.totalRevenue} VND</p>
        <p>Số Lượng Vé Bán Ra: {summary.totalTickets}</p>
        <h3>Doanh Thu Theo Phim</h3>
        <ul>
          {summary.revenueByMovie && summary.revenueByMovie.map((item) => (
            <li key={item._id}>{item._id}: {item.total} VND</li>
          ))}
        </ul>
        <h3>Doanh Thu Theo Rạp</h3>
        <ul>
          {summary.revenueByCinema && summary.revenueByCinema.map((item) => (
            <li key={item._id}>{item._id}: {item.total} VND</li>
          ))}
        </ul>
        <h3>Doanh Thu Theo Ngày</h3>
        <ul>
          {summary.revenueByDate && summary.revenueByDate.map((item) => (
            <li key={item._id}>{item._id}: {item.total} VND</li>
          ))}
        </ul>
      </div>
      <div className="charts">
        <h2>Biểu Đồ Doanh Thu</h2>
        {/* <div className="chart">
          <h3>Doanh Thu Theo Ngày</h3>
          <Bar data={dailyData} options={{ plugins: { legend: { display: true, labels: { color: 'rgba(75, 192, 192, 1)' } } } }} />
        </div>
        <div className="chart">
          <h3>Doanh Thu Theo Tuần</h3>
          <Bar data={weeklyData} options={{ plugins: { legend: { display: true, labels: { color: 'rgba(75, 192, 192, 1)' } } } }} />
        </div> */}
        <div className="chart">
          <h3>Doanh Thu Theo Tháng</h3>
          <Bar data={monthlyData} options={{ plugins: { legend: { display: true, labels: { color: 'rgba(153, 102, 255, 1)' } } } }} />
        </div>
        <div className="chart">
          <h3>Doanh Thu Theo Phim</h3>
          <Bar data={movieData} options={{ plugins: { legend: { display: true, labels: { color: 'rgba(255, 159, 64, 1)' } } } }} />
        </div>
      </div>
      <div className="transactions">
        <h2>Chi Tiết Giao Dịch</h2>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Người Dùng</th>
              <th>Email</th>
              <th>Phim</th>
              <th>Rạp</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Ghế</th>
              <th>Tổng Tiền</th>
              <th>Phương Thức Thanh Toán</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transactions.indexOf(transaction) + 1}</td>
                <td>{transaction.user.name}</td>
                <td>{transaction.user.email}</td>
                <td>{transaction.movieTitle}</td>
                <td>{transaction.cinema}</td>
                <td>{transaction.date}</td>
                <td>{transaction.time}</td>
                <td>{transaction.seats.join(', ')}</td>
                <td>{transaction.totalPrice} VND</td>
                <td>{transaction.paymentMethod}</td>
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