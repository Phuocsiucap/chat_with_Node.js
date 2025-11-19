import express from 'express';
import { getConversations, getMessages, createChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getConversations);
router.post('/', protect, createChat);
router.get('/:chatId/messages', protect, getMessages);

export default router;
