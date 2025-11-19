import User from '../models/userModel.js';
import AppError from '../utils/AppError.js';

const searchUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    
    if (!search) {
      throw new AppError('Please provide a search query', 400);
    }

    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
      _id: { $ne: req.user._id },
    }).select('-password');

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
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
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;
    //kiem tra email
    if (email && email!== req.user.email) {
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
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      throw new AppError('Please provide current password and new password', 400);
    }
    const user = await User.findById(userId).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 401);
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  }catch (error) {
    next(error);
  }
};

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

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (!req.file) {
      throw new AppError('No avatar file uploaded', 400);
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true, select: '-password' }
    );

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Avatar updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const userId = req.user._id;

    if (!password) {
      throw new AppError('Please provide your password', 400);
    }
    
    const user = await User.findById(userId).select('+password');
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new AppError('Password is incorrect', 401);
    }
    
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
  
  searchUsers,
  getUserProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  removeAvatar,
  deleteAccount,
};
