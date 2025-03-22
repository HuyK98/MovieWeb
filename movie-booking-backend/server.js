const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const movieRoutes = require("./routes/movieRoutes");
const Movie = require("./models/Movie");
const showtimesRoutes = require('./routes/showtimes');
const paymentRoutes = require('./routes/payment');
const WebSocket = require('ws');
// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Store connected clients
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);

  // Handle incoming messages
  ws.on('message', (message) => {
    const messageString = message.toString('utf8'); 
    console.log(`Received: ${messageString}`);
    for (const client of clients) {
      // Only send the message to other clients, not the sender
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(messageString); 
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Cấu hình CORS để cho phép frontend (React) truy cập
app.use(cors());

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

// Sử dụng route movie
app.use("/api/movies", movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/showtimes', showtimesRoutes);
app.use('/api/payment', paymentRoutes);


app.get("/", (req, res) => {
  res.send("🎬 Movie Booking API is running...");
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
console.log('WebSocket server running on ws://localhost:8080');
