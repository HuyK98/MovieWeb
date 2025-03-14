const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movieId: mongoose.Schema.Types.ObjectId,
  date: Date,
  times: [String]
});

module.exports = mongoose.model('Showtime', showtimeSchema);
