// websocket.js
const { Server } = require("socket.io");

let io; // Biến toàn cục để lưu thể hiện io

/**
 * Khởi tạo Socket.IO với HTTP server
 * @param {http.Server} server - server HTTP được tạo từ Express
 */
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://movie-web-ace9f.web.app"],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  console.log("🟢 Socket.IO initialized");

  io.on('connection', (socket) => {
    // console.log("🔌 New client connected:", socket.id);

    socket.on('sendMessage', (data) => {
      console.log("💬 Received message:", data);
      io.emit('receiveMessage', data);
    });

    socket.on('sendNotification', (notification) => {
      console.log("🔔 Notification:", notification);
      io.emit('receiveNotification', notification);
    });

    socket.on('disconnect', (reason) => {
      // console.log("❌ Client disconnected:", socket.id, "| Reason:", reason);
    });
  });
}

/**
 * Trả về thể hiện io để sử dụng ở nơi khác
 */
function getIO() {
  if (!io) {
    throw new Error("❗Socket.IO chưa được khởi tạo! Hãy gọi initSocket(server) trước.");
  }
  return io;
}

/**
 * Gửi thông báo từ bất kỳ đâu trong server
 * @param {Object} notification - Nội dung thông báo
 */
function sendNotification(notification) {
  if (!io) {
    throw new Error("❗Socket.IO chưa được khởi tạo! Không thể gửi notification.");
  }
  // console.log("📢 Gửi notification từ server:", notification);
  io.emit('receiveNotification', notification);
}

module.exports = {
  initSocket,
  getIO,
  sendNotification, // 👈 Xuất thêm hàm này
};
