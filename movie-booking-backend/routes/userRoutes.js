const express = require("express");
const { updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.put("/profile", protect, upload, updateUserProfile);

module.exports = router;