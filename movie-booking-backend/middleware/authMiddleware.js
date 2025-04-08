const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            if (!token) {
                res.status(401).json({ message: "Không có token, không được phép truy cập" });
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                res.status(401).json({ message: "Người dùng không tồn tại" });
                return;
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                res.status(401).json({ message: "Token đã hết hạn" });
            } else if (error.name === "JsonWebTokenError") {
                res.status(401).json({ message: "Token không hợp lệ" });
            } else {
                res.status(401).json({ message: "Lỗi xác thực" });
            }
        }
    } else {
        res.status(401).json({ message: "Không có token, không được phép truy cập" });
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Không có quyền truy cập, cần quyền Admin" });
    }
};

module.exports = { protect, admin };