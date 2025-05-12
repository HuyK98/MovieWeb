require('dotenv').config(); // 👈 Load biến môi trường

const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on('connect', () => {
  console.log('✅ Redis client successfully connected to Redis Cloud');
});

client.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

// Kết nối Redis chỉ một lần
if (!client.isOpen) {
  (async () => {
    try {
      await client.connect();
      console.log('✅ Redis client connected');
    } catch (error) {
      console.error('❌ Redis connection error:', error);
    }
  })();
}

module.exports = client;





// Khởi tạo Redis client với cấu hình kết nối cục bộ
// const client = redis.createClient({
//   socket: {
//     host: 'localhost', // Redis server chạy trên máy cục bộ
//     port: 6379,        // Cổng mặc định của Redis
//     connectTimeout: 10000,
//   },
// });
// client.on('connect', () => {
//   console.log('✅ Redis client successfully connected to redis-server');
// });

// client.on('ready', () => {
//   console.log('✅ Redis client is ready to use');
// });

// client.on('error', (err) => {
//   console.error('❌ Redis Client Error:', err);
// });

// client.on('end', () => {
//   console.warn('⚠️ Redis client connection closed');
// });

// // Kết nối Redis
// (async () => {
//   try {
//     await client.connect();
//     console.log('✅ Redis client connected');
//   } catch (error) {
//     console.error('❌ Redis connection error:', error);
//   }
// })();