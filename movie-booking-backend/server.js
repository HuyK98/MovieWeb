const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
const http = require('http'); // Thêm để tạo server HTTP
require("dotenv").config();
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const movieRoutes = require("./routes/movieRoutes");
const showtimesRoutes = require('./routes/showtimes');
const paymentRoutes = require('./routes/payment');
const billRoutes = require('./routes/billRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes1');
const userRoutes = require('./routes/userRoutes');
// require('./websocket'); // Khởi động WebSocket server 
// Create a WebSocket server on port 8080
const { initSocket } = require("./websocket"); // 👈 Import websocket

const app = express();
// Tạo server HTTP từ Express app
const server = http.createServer(app);

// Khởi tạo socket server
initSocket(server); // 👈 Gọi đúng 1 lần
// app.use(cors({
//   origin: "http://localhost:5173", // Địa chỉ frontend
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   credentials: true,
// }));

// Cấu hình CORS cho Express
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// Kiểm tra biến môi trường MONGO_URI
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI không được thiết lập trong .env");
  process.exit(1);
}

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((error) => {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  });

// Sử dụng các route
app.use("/api/movies", movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/showtimes', showtimesRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
// Phục vụ file tĩnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get("/", (req, res) => {
  res.send("🎬 Movie Booking API is running...");
});


// Khởi động server
server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});