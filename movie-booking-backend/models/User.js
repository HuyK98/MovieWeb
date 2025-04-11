const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
  },
  city: {
    type: String,
  },
  district: {
    type: String,
  },
  address: {
    type: String,
  },
  avatar: {
    type: String,  // Trường avatar để lưu đường dẫn ảnh
  },
  image: { 
    type: String,
    default: "/default-avatar.png",
  },
  //phân quyền admin, useruser
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

// Mã hóa mật khẩu trước khi lưu
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Kiểm tra mật khẩu
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;