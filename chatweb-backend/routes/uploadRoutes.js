import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadFile } from '../controllers/uploadController.js';

const router = express.Router();

// Route upload file (dạng form-data)
router.post('/', upload.single('file'), uploadFile);

export default router;
