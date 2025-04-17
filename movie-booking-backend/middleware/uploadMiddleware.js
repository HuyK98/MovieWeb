const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";
    // Kiểm tra nếu thư mục chưa tồn tại, tạo thư mục
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Cấu hình multer để chỉ cho phép file hình ảnh
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(file.originalname.toLowerCase());
    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ hỗ trợ file ảnh"));
    }
  },
}).single("avatar"); // Đảm bảo tên trường là "avatar" khi upload

module.exports = { upload };