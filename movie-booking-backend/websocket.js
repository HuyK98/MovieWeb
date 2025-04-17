const http = require('http');
const { Server } = require('socket.io');
const app = require('./app'); // Express app

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST'],
  },
});

// Lưu trữ mapping giữa userId và socketId
const userSockets = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Thêm xử lý để client đăng ký userId
  socket.on('registerUser', (userId) => {
    console.log(`User ${userId} registered with socket ${socket.id}`);
    userSockets[userId] = socket.id;
  });

  // Lắng nghe tin nhắn từ client
  socket.on('sendMessage', (data) => {
    console.log('Tin nhắn nhận được:', data);
    
    // Chuẩn hóa dữ liệu tin nhắn
    const normalizedMessage = {
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
      isAdmin: !!data.isAdmin, // Đảm bảo isAdmin luôn là boolean
      sender: data.sender || (data.isAdmin ? 'admin' : 'user')
    };

    // Kiểm tra tin nhắn có chứa hình ảnh không
    if (normalizedMessage.imageUrl) {
      console.log('Tin nhắn chứa hình ảnh:', normalizedMessage.imageUrl);
    }

    // Nếu là tin nhắn từ admin, chỉ gửi tới user cụ thể
    if (normalizedMessage.isAdmin && normalizedMessage.userId) {
      const targetSocketId = userSockets[normalizedMessage.userId];
      if (targetSocketId) {
        io.to(targetSocketId).emit('receiveMessage', normalizedMessage);
      } else {
        // Nếu không tìm thấy socket của user, gửi broadcast
        socket.broadcast.emit('receiveMessage', normalizedMessage);
      }
    } 
    // Nếu là tin nhắn từ user, gửi tới tất cả admin
    else {
      // Gửi tin nhắn đến tất cả admin
      // (Giả định admin không có userId cụ thể trong userSockets)
      socket.broadcast.emit('receiveMessage', normalizedMessage);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Xóa khỏi mapping khi disconnect
    for (const [userId, socketId] of Object.entries(userSockets)) {
      if (socketId === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});

// Hàm xuất ra để gửi notification từ chỗ khác trong server
const sendNotification = (notification) => {
  io.emit('receiveNotification', notification);
};

module.exports = { server, io, sendNotification };