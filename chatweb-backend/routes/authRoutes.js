import express from 'express';
import { 
  register, 
  login,
  getProfile,
  updateProfile,
  changePassword,
  updateAvatar,
  removeAvatar,
  deleteAccount
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload, { avatarUpload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.put('/avatar', protect, avatarUpload.single('avatar'), updateAvatar);
router.delete('/avatar', protect, removeAvatar);
router.delete('/account', protect, deleteAccount);

export default router;
