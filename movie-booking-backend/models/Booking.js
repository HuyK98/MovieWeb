const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  movieTitle: {
    type: String,
    required: true,
  },
  cinema: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  seats: {
    type: [String],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
  },
  requestId: {
    type: String,
  },
  orderType: {
    type: String,
  },
  resultCode: {
    type: Number,
  },
  responseTime: {
    type: Number,
  },
  signature: {
    type: String,
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;