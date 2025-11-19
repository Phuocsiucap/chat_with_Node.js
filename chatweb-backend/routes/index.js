import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import chatRoutes from './chatRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import chatInfoRoutes from './chatInfoRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chats', chatRoutes);
router.use('/upload', uploadRoutes);
router.use('/chat-info', chatInfoRoutes);

export default router;
