import React from "react";

const TransactionsTable = ({
  filteredTransactions,
  transactions,
  selectedMonth,
  setSelectedMonth,
  searchTerm,
  setSearchTerm,
  formatDate,
}) => (
  <div className="transactions">
    <h2>Chi Tiết Giao Dịch</h2>
    <div className="filters">
      <label htmlFor="month-select">Chọn Tháng:</label>
      <select
        id="month-select"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {[...Array(12).keys()].map((month) => (
          <option key={month + 1} value={month + 1}>
            Tháng {month + 1}
          </option>
        ))}
      </select>
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
);

export default TransactionsTable;