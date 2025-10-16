import React from "react";
import { Bar } from "react-chartjs-2";

const ChartSection = ({
  selectedChart,
  setSelectedChart,
  dailyData,
  weeklyData,
  monthlyData,
  movieData,
}) => (
  <>
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
  </>
);

export default ChartSection;