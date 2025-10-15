const express = require('express');
const multer = require('multer');
const { storage: firebaseStorage } = require('../config/firebaseConfig');
const { ref: storageRef, uploadBytes, getDownloadURL } = require('firebase/storage');
const { database } = require('../config/firebaseConfig');
const { ref, push, get } = require('firebase/database');
const User = require('../models/User');
const app = express();

const router = express.Router();

app.use('/uploads', express.static('uploads'));

// Cấu hình multer để lưu trữ file
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
  }
});

// upload image firebase
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    // Tạo tên file unique
    const fileName = `chat-images/${Date.now()}-${req.file.originalname}`;
    const imageRef = storageRef(firebaseStorage, fileName);

    // Upload file lên Firebase Storage
    await uploadBytes(imageRef, req.file.buffer, {
      contentType: req.file.mimetype
    });

    // Lấy URL public
    const imageUrl = await getDownloadURL(imageRef);

    console.log('Ảnh được upload:', imageUrl);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Lỗi upload ảnh:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh' });
  }
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

// last message
router.get('/users/last-message', async (req, res) => {
  try {
    console.log('Bắt đầu lấy danh sách user với tin nhắn cuối');
    //lay tat ca user trong db
    const users = await User.find({ role: 'user' }).select('id name email');
    if (!users) {
      console.log('Không tìm thấy user nào');
      return res.json([]);
    }

    // lay last message cua tung user
    const usersWithLastMessage = await Promise.all(  //chay dong thoi cac request
      users.map(async (user) => { //lap qua tung user
        try {
          const messagesRef = ref(database, `messages/${user._id}`);
          const snapshot = await get(messagesRef);

          let lastMessage = null;

          if (snapshot.exists()) {
            const messages = Object.values(snapshot.val()); // lay du lieu tho tu firebase => chuyen thanh array
            const sortedMessages = messages.sort(
              (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
            );
            lastMessage = sortedMessages[0];  //lay phantu dau tien
          }

          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            lastMessage: lastMessage
          };
        } catch (error) {
          console.error(`Lỗi khi lấy tin nhắn cho user ${user._id}:`, error);
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            lastMessage: null
          };
        }
      })
    );

    // sap xep users theo tin nhan moi nhat
    usersWithLastMessage.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });

    res.json(usersWithLastMessage);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách user với tin nhắn cuối:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách user với tin nhắn cuối' });
  }
});

module.exports = router;