const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');
const axios = require('axios');
const crypto = require('crypto');

// Thông tin mẫu từ MoMo
const partnerCode = 'MOMO';
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const redirectUrl = 'http://localhost:5173';
const ipnUrl = 'http://localhost:5000/api/payment/momo-notify';
const requestType = 'payWithMethod';
const lang = 'vi';

// Endpoint để xử lý thanh toán và lưu thông tin đặt vé
router.post('/pay', protect, async (req, res) => {
  const { bookingInfo, selectedSeats, totalPrice, paymentMethod } = req.body;

  try {
    const booking = new Booking({
      user: req.user._id,
      movieTitle: bookingInfo.movieTitle,
      cinema: bookingInfo.cinema,
      date: bookingInfo.date,
      time: bookingInfo.time,
      seats: selectedSeats,
      totalPrice,
      paymentMethod,
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Lỗi khi lưu thông tin đặt vé:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Endpoint để lấy thông tin trạng thái ghế từ cơ sở dữ liệu Booking
router.get('/seats', async (req, res) => {
  const { movieTitle, date, time } = req.query;
  try {
    const bookings = await Booking.find({ movieTitle, date, time });
    const bookedSeats = bookings.reduce((acc, booking) => {
      return acc.concat(booking.seats);
    }, []);
    res.json(bookedSeats);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin ghế:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

// Endpoint để xử lý thanh toán qua MoMo
//account test thanh toán qua momo bằng thẻ ATM
// NGUYEN VAN A
// 9704 0000 0000 0018
// 03/07
// OTP : OTP
router.post('/momo', protect, async (req, res) => {
  const { bookingInfo, selectedSeats, totalPrice, paymentMethod } = req.body;

  try {
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const orderInfo = `Thanh toán vé xem phim ${bookingInfo.movieTitle}`;
    const extraData = ''; // Pass empty value if your merchant does not have stores
    const autoCapture = true;

    const rawSignature = `accessKey=${accessKey}&amount=${totalPrice.toString()}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const momoRequest = {
      partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId,
      amount: totalPrice.toString(),
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature,
    };

    const momoResponse = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', momoRequest, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (momoResponse.data && momoResponse.data.payUrl) {
      // Lưu thông tin đặt vé vào cơ sở dữ liệu trước khi trả về URL thanh toán
      const booking = new Booking({
        user: req.user._id,
        movieTitle: bookingInfo.movieTitle,
        cinema: bookingInfo.cinema,
        date: bookingInfo.date,
        time: bookingInfo.time,
        seats: selectedSeats,
        totalPrice,
        paymentMethod,
        orderId,
        requestId,
      });

      await booking.save();

      res.json({ payUrl: momoResponse.data.payUrl });
    } else {
      console.error('MoMo API response:', momoResponse.data);
      throw new Error('MoMo payment failed');
    }
  } catch (error) {
    if (error.response) {
      console.error('MoMo API response error:', error.response.data);
    } else {
      console.error('Lỗi khi xử lý thanh toán qua MoMo:', error.message);
    }
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

// Endpoint để xử lý thông báo từ MoMo
router.post('/momo-notify', async (req, res) => {
  const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = req.body;

  // Tạo rawSignature để xác minh chữ ký
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;
  const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  try {
    const booking = await Booking.findOneAndUpdate(
      { orderId },
      {
        orderId,
        requestId,
        orderType,
        resultCode,
        payType,
        responseTime,
        signature,
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Payment information updated successfully' });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin thanh toán:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});


// Lấy tổng doanh thu, số lượng vé bán ra, doanh thu theo phim, rạp và ngày
router.get('/summary', async (req, res) => {
  try {
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalTickets = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: { $size: "$seats" } } } }
    ]);

    const revenueByMovie = await Booking.aggregate([
      { $group: { _id: "$movieTitle", total: { $sum: "$totalPrice" } } }
    ]);

    const revenueByCinema = await Booking.aggregate([
      { $group: { _id: "$cinema", total: { $sum: "$totalPrice" } } }
    ]);

    const revenueByDate = await Booking.aggregate([
      { $group: { _id: "$date", total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalTickets: totalTickets[0]?.total || 0,
      revenueByMovie,
      revenueByCinema,
      revenueByDate,
    });
  } catch (error) {
    console.error("Error fetching revenue summary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Lấy chi tiết giao dịch
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Booking.find().populate('user', 'name email');
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Lấy doanh thu theo tuần
router.get('/weekly', async (req, res) => {
  try {
    const weeklyRevenue = await Booking.aggregate([
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: "$date",
              format: "%d/%m/%Y",
              onError: null, // Bỏ qua lỗi nếu không thể chuyển đổi
              onNull: null // Bỏ qua nếu giá trị là null
            }
          }
        }
      },
      {
        $match: {
          date: { $ne: null } // Loại bỏ các bản ghi không thể chuyển đổi ngày
        }
      },
      {
        $group: {
          _id: { $week: "$date" },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(weeklyRevenue);
  } catch (error) {
    console.error("Error fetching weekly revenue:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Lấy doanh thu theo tháng
router.get('/monthly', async (req, res) => {
  try {
    const monthlyRevenue = await Booking.aggregate([
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: "$date",
              format: "%d/%m/%Y",
              onError: null, // Bỏ qua lỗi nếu không thể chuyển đổi
              onNull: null // Bỏ qua nếu giá trị là null
            }
          }
        }
      },
      {
        $match: {
          date: { $ne: null } // Loại bỏ các bản ghi không thể chuyển đổi ngày
        }
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(monthlyRevenue);
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

