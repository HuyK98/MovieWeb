const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  date: { type: String, required: true },
  times: [
    {
      time: { type: String, required: true },
      seats: { type: Number, required: true },
      isBooked: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model('Showtimes', showtimeSchema);