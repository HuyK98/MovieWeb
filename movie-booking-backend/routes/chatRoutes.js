const express = require('express');
const multer = require('multer');
const { database } = require('../config/firebaseConfig');
const { ref, push, get, child } = require('firebase/database');
const app = express();

const router = express.Router();

app.use('/uploads', express.static('uploads'));

// Cấu hình multer để lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint xử lý upload ảnh
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Không có file nào được upload' });
  }

  // Sử dụng BASE_URL từ environment hoặc tự động detect
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  
  console.log('Ảnh được upload:', imageUrl); 
  res.json({ imageUrl });
});

// Endpoint lưu tin nhắn vào Firebase
router.post('/messages', async (req, res) => {
  try {
    const { userId, sender, text, imageUrl, timestamp } = req.body;

    // Đảm bảo các trường không bị undefined
    const newMessage = {
      sender: sender || 'unknown',
      text: text || '',
      imageUrl: imageUrl || null,
      timestamp: timestamp || new Date().toISOString(),
    };

    // Lưu tin nhắn vào Firebase
    const messagesRef = ref(database, `messages/${userId}`);
    await push(messagesRef, newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Lỗi khi lưu tin nhắn:', error);
    res.status(500).json({ error: 'Lỗi khi lưu tin nhắn' });
  }
});

// Endpoint lấy tin nhắn từ Firebase
router.get('/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Lấy tin nhắn từ Firebase
    const messagesRef = ref(database, `messages/${userId}`);
    const snapshot = await get(messagesRef);

    if (snapshot.exists()) {
      res.status(200).json(Object.values(snapshot.val()));
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error('Lỗi khi lấy tin nhắn:', error);
    res.status(500).json({ error: 'Lỗi khi lấy tin nhắn' });
  }
});

module.exports = router;