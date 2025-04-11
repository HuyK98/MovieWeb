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

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Lắng nghe tin nhắn từ client
  socket.on('sendMessage', (data) => {
    console.log('Tin nhắn nhận được:', data);

    // Gửi tin nhắn đến tất cả client
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});