const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Cấu hình Cloudinary từ .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Multer (lưu ảnh trong bộ nhớ trước khi upload lên Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 **Thêm phim mới (Upload ảnh và video lên Cloudinary)**
router.post("/add", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  // console.log("Dữ liệu nhận từ frontend:", req.body);
  try {
    const { title, description, releaseDate, genre } = req.body;

    if (!req.files.image || !req.files.video) {
      return res.status(400).json({ error: "Chưa có ảnh hoặc video tải lên" });
    }

    // ✅ Upload ảnh lên Cloudinary
    const imageUpload = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "movies" }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }).end(req.files.image[0].buffer);
    });

    // ✅ Upload video lên Cloudinary
    const videoUpload = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: "video", folder: "movies" }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }).end(req.files.video[0].buffer);
    });

    const [imageUrl, videoUrl] = await Promise.all([imageUpload, videoUpload]);

    const newMovie = new Movie({
      title,
      description,
      imageUrl,
      videoUrl,
      releaseDate,
      genre,
    });

    await newMovie.save();
    res.status(201).json({ message: "Thêm phim thành công!", newMovie });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// 📌 **Lấy danh sách phim**
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phim:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// 📌 **Lấy thông tin phim theo ID**
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Get the movie ID from the request parameters
  try {
    const movie = await Movie.findById(id); // Find the movie by its ID
    if (!movie) {
      return res.status(404).json({ message: "Phim không tồn tại" }); // Return 404 if the movie is not found
    }
    res.json(movie); // Return the movie details
  } catch (error) {
    console.error("Lỗi khi lấy thông tin phim:", error);
    res.status(500).json({ error: "Lỗi server" }); // Return 500 if there is a server error
  }
});

// 📌 **Xóa phim**
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Received DELETE request for ID:", id);
  try {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      console.log("Movie not found with ID:", id);
      return res.status(404).json({ message: "Phim không tồn tại" });
    }
    console.log("Movie deleted successfully:", movie);
    res.status(200).json({ message: "Xóa phim thành công" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
});

// Route PUT để cập nhật phim
router.put("/:id", upload.fields([{ name: "image" }, { name: "video" }]), async (req, res) => {
  const { id } = req.params;
  const { title, description, releaseDate, genre } = req.body;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: "Phim không tồn tại" });
    }

    // Cập nhật các trường văn bản
    movie.title = title || movie.title;
    movie.description = description || movie.description;
    movie.releaseDate = releaseDate || movie.releaseDate;
    movie.genre = genre || movie.genre;

    // Cập nhật ảnh nếu có file mới
    if (req.files && req.files.image) {
      movie.imageUrl = req.files.image[0].path;
    }

    // Cập nhật video nếu có file mới
    if (req.files && req.files.video) {
      movie.videoUrl = req.files.video[0].path;
    }

    const updatedMovie = await movie.save();
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error("Error updating movie:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
});


module.exports = router;