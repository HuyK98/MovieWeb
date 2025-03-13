const express = require('express');
const router = express.Router();
const Showtimes = require('../models/Showtimes');

// Lấy tất cả lịch chiếu hoặc lọc theo movieId
router.get('/', async (req, res) => {
  const { movieId } = req.query;
  try {
    let showtimes;
    if (movieId) {
      showtimes = await Showtimes.find({ movieId }).populate('movieId');
    } else {
      showtimes = await Showtimes.find().populate('movieId');
    }
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Thêm lịch chiếu mới
router.post('/', async (req, res) => {
  const { movieId, date, time, seats } = req.body;
  try {
    let showtime = await Showtimes.findOne({ movieId, date });
    if (showtime) {
      showtime.times.push({ time, seats: 70 });
    } else {
      showtime = new Showtimes({ movieId, date, times: [{ time, seats: 70 }] });
    }
    await showtime.save();
    res.status(201).json(showtime);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Thêm giờ chiếu mới
router.post('/:id/time', async (req, res) => {
  const { time, seats } = req.body;
  try {
    const showtime = await Showtimes.findById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ message: 'Lịch chiếu không tồn tại' });
    }
    showtime.times.push({ time, seats });
    await showtime.save();
    res.status(201).json(showtime);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Chỉnh sửa giờ chiếu
router.put('/:id/time/:timeId', async (req, res) => {
  const { time } = req.body;
  try {
    const showtime = await Showtimes.findById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ message: 'Lịch chiếu không tồn tại' });
    }
    const timeSlot = showtime.times.id(req.params.timeId);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Giờ chiếu không tồn tại' });
    }
    timeSlot.time = time;
    timeSlot.seats = 70; // Mặc định số ghế là 70
    await showtime.save();
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Xóa giờ chiếu
router.delete('/:id/time/:timeId', async (req, res) => {
  try {
    const showtime = await Showtimes.findById(req.params.id);
    if (!showtime) {
      return res.status(404).json({ message: 'Lịch chiếu không tồn tại' });
    }
    const timeSlot = showtime.times.id(req.params.timeId);
    if (!timeSlot) {
      return res.status(404).json({ message: 'Giờ chiếu không tồn tại' });
    }
    timeSlot.remove();
    await showtime.save();
    res.json({ message: 'Giờ chiếu đã được xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;