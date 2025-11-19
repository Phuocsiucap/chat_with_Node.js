import express from 'express';
import { searchUsers, getUserProfile, updateAvatar, updateProfile, removeAvatar, deleteAccount, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/password', protect, changePassword);
router.put('/profile/avatar', protect, updateAvatar);
router.delete('/profile/avatar', protect, removeAvatar);
router.delete('/', protect, deleteAccount);

export default router;
