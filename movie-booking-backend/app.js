const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const movieRoutes = require("./routes/movieRoutes");
const showtimesRoutes = require('./routes/showtimes');
const paymentRoutes = require('./routes/payment');
const billRoutes = require('./routes/billRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ["https://movie-web-ace9f.web.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/showtimes", showtimesRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("🎬 Movie Booking API is running...");
});

module.exports = app;
