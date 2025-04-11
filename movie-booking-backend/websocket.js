// socket-server.js
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // Express app nếu bạn đang dùng

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend origin
    methods: ['GET', 'POST'],
  },
});

// Lưu trữ client nếu cần (tuỳ vào tính năng mở rộng)
const clients = new Set();

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  clients.add(socket);

  // Xử lý tin nhắn từ client
  socket.on('sendMessage', (data) => {
    console.log('💬 Chat message:', data);
    io.emit('receiveMessage', data); // Gửi cho tất cả client
  });

  // Xử lý thông báo realtime (có thể phân biệt nếu muốn)
  socket.on('sendNotification', (notification) => {
    console.log('🔔 Notification:', notification);
    io.emit('receiveNotification', notification); // Gửi tất cả
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
    clients.delete(socket);
  });
});


// Hàm xuất ra để gửi notification từ chỗ khác trong server
const sendNotification = (notification) => {
  io.emit('receiveNotification', notification);
};

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});

module.exports = { server, io, sendNotification };
