import path from 'path';

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`; // đường dẫn tĩnh
    const fileInfo = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: fileUrl,
    };

    // Trả về dữ liệu để bạn lưu vào MongoDB
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: fileInfo,
    });
  } catch (error) {
    next(error);
  }
};

export { uploadFile };
