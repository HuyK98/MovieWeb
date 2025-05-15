const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/authMiddleware');
const { OAuth2Client } = require('google-auth-library'); // Import OAuth2Client
require('dotenv').config(); // Import dotenv để sử dụng biến môi trường
const multer = require('multer');
const path = require('path');
// Đăng ký
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Lấy thông tin người dùng hiện tại and Cập nhật thông tin người dùng hiện tại (admin)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin người dùng' });
  }
});

// Lấy danh sách người dùng
router.get('/users', protect, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Chỉnh sửa người dùng
router.put('/users/:id', protect, async (req, res) => {
  const { name, email, phone, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.role = role || user.role;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Xóa người dùng
router.delete('/users/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: 'Người dùng đã được xóa' });
    } else {
      res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Tạo một instance của OAuth2Client

// Đăng nhập bằng tài khoản Google
router.post('/google-login', async (req, res) => {
  const { tokenId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID, // Sử dụng biến môi trường
    });
    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(sub, 10); // Băm sub làm mật khẩu
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone: '0000000000', // Giá trị mặc định cho phone
        role: 'user', // Đặt vai trò mặc định là 'user'
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({
      message: 'Đăng nhập thành công',
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(400).json({ message: 'Đăng nhập bằng Google thất bại', error });
  }
});

// Cấu hình multer để lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục lưu trữ hình ảnh
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Đặt tên file duy nhất
  },
});

// Kiểm tra định dạng file
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/; // Các định dạng được phép
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép các định dạng ảnh: .jpeg, .jpg, .png, .gif, .webp'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file: 5MB
});

// API upload hình ảnh
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.error("User not found for ID:", req.user.id); // Log nếu không tìm thấy người dùng
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    if (!req.file) {
      console.error("No file uploaded"); // Log nếu không có file được tải lên
      return res.status(400).json({ message: 'Không có file nào được tải lên' });
    }

    // Cập nhật URL hình ảnh vào cơ sở dữ liệu
    user.image = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ message: 'Hình ảnh đã được upload', imageUrl: user.image });
  } catch (error) {
    console.error("Error in upload API:", error); // Log chi tiết lỗi
    res.status(500).json({ message: 'Lỗi máy chủ khi upload hình ảnh', error: error.message });
  }
});

module.exports = router;