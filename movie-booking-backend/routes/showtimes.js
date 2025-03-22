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


//QUẢN LÝ LỊCH CHIẾU

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
router.put('/:showtimeId/time/:timeId', async (req, res) => {
  try {
    const { showtimeId, timeId } = req.params;
    const { time, seats } = req.body;

    const showtime = await Showtimes.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const timeIndex = showtime.times.findIndex(t => t._id.toString() === timeId);
    if (timeIndex === -1) {
      return res.status(404).json({ message: 'Time not found' });
    }

    showtime.times[timeIndex].time = time;
    showtime.times[timeIndex].seats = seats;

    await showtime.save();
    res.json(showtime);
  } catch (error) {
    console.error('Error updating showtime:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Xóa giờ chiếu
router.delete('/:showtimeId/time/:timeId', async (req, res) => {
  try {
    const { showtimeId, timeId } = req.params;

    const showtime = await Showtimes.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    showtime.times = showtime.times.filter(t => t._id.toString() !== timeId);

    await showtime.save();
    res.json({ message: 'Time deleted successfully' });
  } catch (error) {
    console.error('Error deleting showtime:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;