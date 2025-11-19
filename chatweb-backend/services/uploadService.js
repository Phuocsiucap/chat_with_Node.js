import cloudinary from '../config/cloudinary.js';
import AppError from '../utils/AppError.js';

const uploadFile = async (filePath, folder = 'uploads') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto', // cho phép ảnh, video, pdf...
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      size: result.bytes,
    };
  } catch (err) {
    console.error('Upload error:', err);
    throw new AppError('File upload failed', 500);
  }
};

export {
  uploadFile,
};
