const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

const app = require("./app");
const { initSocket } = require("./websocket");

// Tạo HTTP server
const server = http.createServer(app);

// Khởi tạo socket
initSocket(server);

// Kết nối MongoDB
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI không được thiết lập trong .env");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err.message);
    process.exit(1);
  });

// Lắng nghe port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
