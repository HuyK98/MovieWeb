    const express = require('express');
const User = require('../models/User');  // Giả sử bạn đã tạo model User
const jwt = require('jsonwebtoken');    // Dùng để xác thực JWT token
const router = express.Router();

// Middleware xác thực token JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Lấy token từ header

  if (!token) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Giải mã token với secret key
    req.user = decoded;  // Lưu thông tin người dùng vào req
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token hết hạn hoặc không hợp lệ' });
  }
};

// Route lấy thông tin profile người dùng
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);  // Lấy người dùng theo ID từ token
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.json(user);  // Trả về thông tin người dùng
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra' });
  }
});

module.exports = router;
