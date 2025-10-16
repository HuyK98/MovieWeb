import React, { useState, useEffect, lazy, Suspense } from "react";
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
  LineController,
  BarController,
} from "chart.js";
import "../styles_admin/Revenue.css";
import { FaBars } from "react-icons/fa";
import API_URL from "../api/config";
import FallbackTank from "../components/FallbackTank";

const Sidebar = lazy(() => import("./admin_layout/Sidebar"));
const HeaderAdmin = lazy(() => import("./admin_layout/HeaderAdmin"));
const TotalSummary = lazy(() => import("./components/TotalSummary"));
const ChartSection = lazy(() => import("./components/ChartSection"));
const TransactionsTable = lazy(() => import("./components/TransactionsTable"));

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Legend,
  LineController,
  BarController
);

const Revenue = () => {
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [revenueByMovie, setRevenueByMovie] = useState([]);
  const [selectedChart, setSelectedChart] = useState("daily");
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/payment/summary`);
        setSummary(response.data);
      } catch (error) {
        setError("Không thể tải dữ liệu doanh thu.", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/payment/transactions`);
        setTransactions(response.data);

        const currentMonth = new Date().getMonth() + 1;
        setSelectedMonth(currentMonth.toString());

        const filtered = response.data.filter((transaction) => {
          const month = new Date(transaction.date).getMonth() + 1;
          return month === currentMonth;
        });
        setFilteredTransactions(filtered);
      } catch (error) {
        setError("Không thể tải dữ liệu giao dịch.", error);
      }
    };

    const fetchDailyRevenue = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/payment/daily`);
        setDailyRevenue(response.data);
      } catch (error) {
        setError("Không thể tải dữ liệu doanh thu theo ngày.", error);
      }
    };

    const fetchWeeklyRevenue = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/payment/weekly`);
        setWeeklyRevenue(response.data);
      } catch (error) {
        setError("Không thể tải dữ liệu doanh thu theo tuần.", error);
      }
    };

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/payment/monthly`);
        setMonthlyRevenue(response.data);
      } catch (error) {
        setError("Không thể tải dữ liệu doanh thu theo tháng.",error);
      }
    };
    const fetchRevenueByMovie = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/payment/by-movie`);
        setRevenueByMovie(response.data);
      } catch (error) {
        setError("Không thể tải dữ liệu doanh thu theo phim.", error);
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
        type: "bar",
        label: "Doanh thu theo ngày (Bar)",
        data: dailyRevenue.map((item) => item.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        type: "line",
        label: "Doanh thu theo ngày (Line)",
        data: dailyRevenue.map((item) => item.total),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
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

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  useEffect(() => {
    let filtered = transactions;
    if (selectedMonth) {
      filtered = transactions.filter((transaction) => {
        const month = new Date(transaction.date).getMonth() + 1;
        return month === parseInt(selectedMonth);
      });
    }
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
      <Suspense fallback={<FallbackTank />}>
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
      </Suspense>
      <Suspense fallback={<FallbackTank />}>
        <HeaderAdmin />
      </Suspense>
      <button
        className="collapse-button"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <FaBars />
      </button>
      <div className="revenue-container">
        <h1>Quản Lý Doanh Thu</h1>
        {error && <p className="error">{error}</p>}
        <Suspense fallback={<FallbackTank />}>
          <TotalSummary summary={summary} formatDate={formatDate} />
        </Suspense>
        <Suspense fallback={<FallbackTank />}>
          <ChartSection
            selectedChart={selectedChart}
            setSelectedChart={setSelectedChart}
            dailyData={dailyData}
            weeklyData={weeklyData}
            monthlyData={monthlyData}
            movieData={movieData}
          />
        </Suspense>
        <Suspense fallback={<FallbackTank />}>
          <TransactionsTable
            filteredTransactions={filteredTransactions}
            transactions={transactions}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            formatDate={formatDate}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Revenue;