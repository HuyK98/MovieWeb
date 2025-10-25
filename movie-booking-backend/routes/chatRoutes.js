const express = require('express');
const multer = require('multer');
const { database } = require('../config/firebaseConfig');
const { cloudinary, upload } = require('../config/cloudinaryConfig');
const { ref, push, get } = require('firebase/database');
const User = require('../models/User');
const app = express();

const router = express.Router();

app.use('/uploads', express.static('uploads'));

//ham phat hien link trong text
const detectLinks = (text) => {
  if (!text || typeof text !== 'string') return [];
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  const matches = text.match(urlRegex);
  return matches || [];
};

// ham xac dinh loai tin nhan
const getMessageType = (text, imageUrl) => {
  if (imageUrl) return 'image';
  if (!text) return 'text';
  const links = detectLinks(text);
  if (links.length > 0) return 'link';
  return 'text';
};

// upload image firebase
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Không có file nào được upload' });
    }

    //cloudinary tu dong update,multer tra ve thong tin
    const imageData = {
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
      imageSize: req.file.size,
      imageName: req.file.originalname,
    };

    console.log('Ảnh được upload len Cloudinary:', imageData.imageUrl);
    res.json(imageData);
  } catch (error) {
    console.error('Lỗi upload ảnh:', error);
    res.status(500).json({ error: 'Lỗi khi upload ảnh' });
  }
});

// Xoa anh tren cloudinary
router.delete('/upload/:cloudinaryId', async (req, res) => {
  try {
    const { cloudinaryId } = req.params; //lay id tu params 
    await cloudinary.uploader.destroy(cloudinaryId);  //xoa tren cloudinary
    console.log('Ảnh đã được xóa khỏi Cloudinary:', cloudinaryId);
    res.json({ message: 'Ảnh đã được xóa khỏi Cloudinary' });
  } catch (error) {
    console.error('Lỗi khi xóa ảnh:', error);
    res.status(500).json({ error: 'Lỗi khi xóa ảnh' });
  }
});

// Endpoint lưu tin nhắn vào Firebase
router.post('/messages', async (req, res) => {
  try {
    const { userId, sender, text, imageUrl, cloudinaryId, imageSize, imageName, timestamp } = req.body;

    //xac dinh loai tn
    const messageType = getMessageType(text, imageUrl);

    //extract links
    const links = messageType === 'link' ? detectLinks(text) : [];

    // tao message object 
    const newMessage = {
      sender: sender || 'unknown',
      text: text || '',
      imageUrl: imageUrl || null,
      cloudinaryId: cloudinaryId || null,
      imageSize: imageSize || null,
      imageName: imageName || null,
      timestamp: timestamp || new Date().toISOString(),
      messageType: messageType,
      links: links
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
      const messages = Object.values(snapshot.val());
      res.status(200).json(messages);
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