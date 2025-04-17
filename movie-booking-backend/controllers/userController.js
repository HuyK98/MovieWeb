const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    // Cập nhật các thông tin khác
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.cmnd = req.body.cmnd || user.cmnd;
    user.dob = req.body.dob || user.dob;
    user.gender = req.body.gender || user.gender;
    user.city = req.body.city || user.city;
    user.district = req.body.district || user.district;
    user.address = req.body.address || user.address;

    // Nếu có file (avatar) thì cập nhật đường dẫn avatar
    if (req.file) {
      // Thay đổi đường dẫn để phù hợp với việc hiển thị ảnh từ thư mục public
      user.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    // Tạo lại JWT với thông tin mới của người dùng
    const token = jwt.sign(
      { id: updatedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      message: "Cập nhật thành công",
      user: updatedUser,
      token, // Trả lại token mới
    });
  } else {
    res.status(404);
    throw new Error("Người dùng không tồn tại");
  }
});

module.exports = { updateUserProfile };