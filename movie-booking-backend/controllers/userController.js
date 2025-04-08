const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.cmnd = req.body.cmnd || user.cmnd;
        user.dob = req.body.dob || user.dob;
        user.gender = req.body.gender || user.gender;
        user.city = req.body.city || user.city;
        user.district = req.body.district || user.district;
        user.address = req.body.address || user.address;

        if (req.file) {
            user.avatar = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await user.save();

        // Tạo lại JWT với thông tin cần thiết
        const token = jwt.sign(
            {
                id: updatedUser._id,
                name: updatedUser.name, // Thêm tên người dùng vào token (nếu cần)
                // Thêm các thông tin khác nếu cần
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            message: "Cập nhật thành công",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                cmnd: updatedUser.cmnd,
                dob: updatedUser.dob,
                gender: updatedUser.gender,
                city: updatedUser.city,
                district: updatedUser.district,
                address: updatedUser.address,
                avatar: updatedUser.avatar,
            },
            token,
        });
    } else {
        res.status(404);
        throw new Error("Người dùng không tồn tại");
    }
});

module.exports = { updateUserProfile };