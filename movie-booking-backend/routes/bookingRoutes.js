const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

// API để lấy danh sách bookings và thông tin từ bảng Bill
router.get('/', async (req, res) => {
  try {
    const { userId, paymentMethod } = req.query;

    // Tạo query để lọc theo userId và phương thức thanh toán
    const query = {};
    if (userId) query.user = userId;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    // Lấy danh sách bookings và populate thông tin từ bảng movies
    const bookings = await Booking.find(query).
    populate('movie', 'title genre imageUrl')
    .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo (mới nhất trước)

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bookings:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bookings.', error });
  }
});

// API để lấy thông tin booking theo ID
router.get('/booking/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Tìm booking theo ID và populate thông tin từ bảng movies và users
    const booking = await Booking.findById(bookingId)
      .populate('movie', 'title imageUrl genre releaseDate') // Populate thông tin từ bảng movies
      .populate('user', 'name email phone'); // Populate thông tin từ bảng users

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin booking.' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin booking:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin booking.', error });
  }
});

// API để cập nhật imageUrl cho tất cả các bookings
router.patch('/update-image-urls', async (req, res) => {
  try {
    // Lấy danh sách tất cả các bookings
    const bookings = await Booking.find();

    // Lặp qua từng booking và cập nhật imageUrl
    for (const booking of bookings) {
      // Tìm movie dựa trên movieTitle
      const movie = await Movie.findOne({ title: booking.movieTitle });
      if (movie) {
        // Cập nhật imageUrl cho booking
        await Booking.findByIdAndUpdate(
          booking._id,
          { imageUrl: movie.imageUrl },
          { new: true }
        );
      }
    }

    res.status(200).json({ message: 'Đã cập nhật imageUrl cho tất cả các bookings.' });
  } catch (error) {
    console.error('Lỗi khi cập nhật imageUrl:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật imageUrl.', error });
  }
});

module.exports = router;