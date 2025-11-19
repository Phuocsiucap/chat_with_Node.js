import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import AppError from '../utils/AppError.js';

const registerUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError('Email already exists', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user._id),
  };
};

export {
  registerUser,
  loginUser,
};
