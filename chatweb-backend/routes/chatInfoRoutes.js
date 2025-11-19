import express from 'express';
import { 
  getChatInfo, 
  getSharedMedia, 
  getSharedFiles, 
  getSharedLinks 
} from '../controllers/chatInfoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/chat-info/:chatId - Lấy thông tin cơ bản của chat
router.get('/:chatId', protect, getChatInfo);

// GET /api/chat-info/:chatId/media - Lấy ảnh/video đã chia sẻ
router.get('/:chatId/media', protect, getSharedMedia);

// GET /api/chat-info/:chatId/files - Lấy file đã chia sẻ
router.get('/:chatId/files', protect, getSharedFiles);

// GET /api/chat-info/:chatId/links - Lấy link đã chia sẻ
router.get('/:chatId/links', protect, getSharedLinks);

export default router;