import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import AppError from '../utils/AppError.js';

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Not authorized, no token', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      throw new AppError('User not found', 401);
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Not authorized, invalid token', 401));
    } else {
      next(error);
    }
  }
};

export { protect };
