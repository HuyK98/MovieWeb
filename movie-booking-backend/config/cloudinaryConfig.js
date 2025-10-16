const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

//cau hinh cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// cau hinh storage cho multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chat-images', // thu muc luu anh tren cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
        transformation: [
            { width: 1000, height: 1000, crop: 'limit' } // gioi han kich thuoc anh
        ],
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh!'), false);
        }
    }
});

module.exports = { cloudinary, upload };