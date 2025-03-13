const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, // Lưu URL ảnh từ Cloudinary
  videoUrl: { type: String, required: true }, // Lưu URL video từ Cloudinary
  releaseDate: { type: Date, required: true },
  genre: { type: String, required: true },
});

module.exports = mongoose.model("Movie", MovieSchema);
