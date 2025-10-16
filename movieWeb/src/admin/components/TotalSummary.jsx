import React from "react";

const TotalSummary = ({ summary, formatDate }) => (
  <div className="summary">
    <h2>Tổng Quan</h2>
    <p>
      Tổng Doanh Thu: {summary.totalRevenue?.toLocaleString("vi-VN")} VND
    </p>
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
            {formatDate(item._id)}: {item.total?.toLocaleString("vi-VN")} VND
          </li>
        ))}
    </ul>
  </div>
);

export default TotalSummary;