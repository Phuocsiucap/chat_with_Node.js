import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Thư mục lưu file
const uploadDir = path.join(__dirname, '../uploads');

// Tạo thư mục nếu chưa có
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình nơi lưu file tạm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);

    // Giữ tiếng Việt, thay ký tự đặc biệt thành _
    const safeName = base.replace(/[^a-zA-Z0-9\u00C0-\u1EF9\s-_]/g, '_');

    cb(null, `${safeName}_${Date.now()}${ext}`);
  },
});

// Bộ lọc loại file
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'video/mp4',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/zip',
    'application/x-zip-compressed',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`));
  }
};

// Avatar storage với folder riêng cho từng user
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.id || 'anonymous';
    const avatarDir = path.join(uploadDir, 'avatars', userId);
    
    // Tạo thư mục nếu chưa có
    if (!fs.existsSync(avatarDir)) {
      fs.mkdirSync(avatarDir, { recursive: true });
    }
    
    cb(null, avatarDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${Date.now()}${ext}`);
  },
});

// Bộ lọc cho avatar (chỉ cho phép ảnh)
const avatarFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)'));
  }
};

// Tạo middleware upload
const upload = multer({ storage, fileFilter });
const avatarUpload = multer({ 
  storage: avatarStorage, 
  fileFilter: avatarFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export default upload;
export { avatarUpload };
