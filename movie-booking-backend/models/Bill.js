const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  movie: {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    genre: { type: String, required: true },
  },
  booking: {
    date: { type: Date, required: true },
    seats: { type: [String], required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);