const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const movieRoutes = require("./routes/movieRoutes");
const showtimesRoutes = require("./routes/showtimes");
const paymentRoutes = require("./routes/payment");
const billRoutes = require("./routes/billRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const chatRoutes = require("./routes/chatRoutes");
const path = require("path");

const app = express();

const allowlist = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// Express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); 
      return cb(null, allowlist.includes(origin));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI không được thiết lập trong .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((error) => {
    console.error("Lỗi kết nối MongoDB:", error.message);
    process.exit(1);
  });

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/showtimes", showtimesRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/chat", chatRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Movie Booking API is running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowlist,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Tin nhắn nhận được:", data);
    io.emit("receiveMessage", data);
  });

  socket.on("typing", (data) => {
    console.log(`User ${socket.id} đang gõ...`, data);
    socket.broadcast.emit("typing", data);
  });

  socket.on("stopTyping", (data) => {
    console.log(`User ${socket.id} dừng gõ.`, data);
    socket.broadcast.emit("stopTyping", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
