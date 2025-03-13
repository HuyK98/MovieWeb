const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Route chỉ dành cho admin
router.get('/dashboard', protect, admin, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

module.exports = router;