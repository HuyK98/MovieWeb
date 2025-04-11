const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const { sendNotification, clients } = require('../websocket'); // Đường dẫn tùy thuộc vào vị trí file

// API để lấy danh sách bookings và thông tin từ bảng Bill
router.get('/', async (req, res) => {
  try {
    const { userId, paymentMethod } = req.query;

    // Tạo query để lọc theo userId và phương thức thanh toán
    const query = {};
    if (userId) query.user = userId;
    if (paymentMethod) query.paymentMethod = paymentMethod;

    // Lấy danh sách bookings và populate thông tin từ bảng movies
    const bookings = await Booking.find(query)
    .populate('movie', 'title genre imageUrl')
    .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo (mới nhất trước)

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

// API để lấy danh sách thông báo booking mới nhất thông báo về Admin
router.get('/notifications', async (req, res) => {
  try {
    // Lấy danh sách các booking mới nhất, sắp xếp theo thời gian tạo (mới nhất trước)
    const notifications = await Booking.find({ isRead: false}) // Chỉ lấy thông báo chưa được xem
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo (mới nhất trước)
      .limit(10) // Giới hạn số lượng thông báo trả về
      // .select("user movie createdAt title") // Chỉ lấy các trường cần thiết
      .populate('user', 'name') // Populate thông tin người dùng
      .populate('movie', 'title'); // Populate thông tin phim

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách thông báo:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách thông báo.', error });
  }
});

// Khi admin click vào một thông báo, cập nhật trạng thái isRead
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Booking.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true; // Đánh dấu thông báo đã đọc
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});


// Khi tạo thông báo mới (ví dụ: khi có booking mới)
router.post('/create-booking', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();

    // Populate thông tin người dùng và phim
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('user', 'name imageUrl')
      .populate('movie', 'title');

    // Gửi thông báo qua WebSocket
    sendNotification({
      _id: populatedBooking._id,
      user: populatedBooking.user,
      movieTitle: populatedBooking.movie.title,
      createdAt: populatedBooking.createdAt,
    });

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

module.exports = router;