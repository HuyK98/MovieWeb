const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem có header Authorization và token hợp lệ không
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    // Nếu không có token
    if (!token) {
      res.status(401).json({ message: "Không có token, không được phép truy cập" });
      return;
    }

    try {
      // Giải mã token và lấy thông tin người dùng
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password"); // Lấy thông tin người dùng ngoại trừ mật khẩu
      next();
    } catch (error) {
      res.status(401).json({ message: "Token không hợp lệ" });
    }
  } else {
    res.status(401).json({ message: "Không có token, không được phép truy cập" });
  }
};

// Kiểm tra quyền Admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Không có quyền truy cập, cần quyền Admin" });
  }
};

module.exports = { protect, admin };
