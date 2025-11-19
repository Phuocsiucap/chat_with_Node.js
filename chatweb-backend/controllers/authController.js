import { registerUser, loginUser } from '../services/authService.js';
import User from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      throw new AppError('Please provide all required fields', 400);
    }

    const result = await registerUser({ name, email, password });
    
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const result = await loginUser({ email, password });
    
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Profile Management

// Lấy thông tin profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông tin cơ bản
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    // Kiểm tra email đã tồn tại chưa (nếu thay đổi email)
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        throw new AppError('Email already exists', 400);
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Thay đổi mật khẩu
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      throw new AppError('Please provide current password and new password', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters', 400);
    }

    // Lấy user với password
    const user = await User.findById(userId).select('+password');
    
    // Kiểm tra mật khẩu hiện tại
    const isCurrentPasswordCorrect = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật avatar
const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh'
      });
    }

    // Xóa avatar cũ nếu có
    const user = await User.findById(userId);
    if (user.avatar && user.avatar !== '/uploads/default-avatar.png') {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Lưu đường dẫn avatar mới (với folder avatars/{userId})
    const avatarPath = `/uploads/avatars/${userId}/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      message: 'Cập nhật avatar thành công',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    next(error);
  }
};

// Xóa avatar
const removeAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: '' },
      { new: true, select: '-password' }
    );

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Avatar removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Xóa tài khoản
const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password) {
      throw new AppError('Please provide your password to confirm account deletion', 400);
    }

    // Lấy user với password để xác thực
    const user = await User.findById(userId).select('+password');
    
    // Kiểm tra mật khẩu
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      throw new AppError('Password is incorrect', 400);
    }

    // Xóa user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  removeAvatar,
  deleteAccount,
};
