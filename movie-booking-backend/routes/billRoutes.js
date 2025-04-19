const express = require('express');
const Bill = require('../models/Bill');
const router = express.Router();

// API để lưu hóa đơn
router.post('/create', async (req, res) => {
  try {
    const billData = req.body;
    const newBill = new Bill(billData);
    await newBill.save();
    res.status(201).json({ message: 'Hóa đơn đã được lưu thành công!', bill: newBill });
  } catch (error) {
    console.error('Lỗi khi lưu hóa đơn:', error);
    res.status(500).json({ message: 'Lỗi khi lưu hóa đơn.', error });
  }
});

// API để lấy danh sách hóa đơn theo tên người dùng và phương thức thanh toán
router.get('/', async (req, res) => {
  try {
    const { name, paymentMethod } = req.query;
    // Tạo query để lọc theo tên người dùng và phương thức thanh toán
    const query = {};
    if (name) query["user.name"] = name;
    if (paymentMethod) query["booking.paymentMethod"] = paymentMethod;

    const bills = await Bill.find(query);

    res.status(200).json(bills);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hóa đơn:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách hóa đơn.', error });
  }
});

// API để lấy hóa đơn theo paymentMethod
router.get('/bills', async (req, res) => {
  try {
    const { paymentMethod } = req.query;
    let query = {};

    // Nếu có paymentMethod trong query, thêm vào điều kiện tìm kiếm
    if (paymentMethod) {
      query["booking.paymentMethod"] = paymentMethod;
    }

    const bills = await Bill.find(query);
    res.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ message: 'Error fetching bills' });
  }
});


// API để sửa hóa đơn
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBill = await Bill.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBill) {
      return res.status(404).json({ message: 'Hóa đơn không tồn tại.' });
    }
    res.status(200).json({ message: 'Hóa đơn đã được cập nhật thành công!', bill: updatedBill });
  } catch (error) {
    console.error('Lỗi khi sửa hóa đơn:', error);
    res.status(500).json({ message: 'Lỗi khi sửa hóa đơn.', error });
  }
});

// API để xóa hóa đơn
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBill = await Bill.findByIdAndDelete(id);
    if (!deletedBill) {
      return res.status(404).json({ message: 'Hóa đơn không tồn tại.' });
    }
    res.status(200).json({ message: 'Hóa đơn đã được xóa thành công!' });
  } catch (error) {
    console.error('Lỗi khi xóa hóa đơn:', error);
    res.status(500).json({ message: 'Lỗi khi xóa hóa đơn.', error });
  }
});

module.exports = router;