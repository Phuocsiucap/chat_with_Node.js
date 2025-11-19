import api from './api';
import { handleAxiosError } from '../utils/errorHandler';


const uploadService = {
  async upload(file) {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await api.post(`/upload`, formData, 
          {
            headers: {
              "Content-Type": "multipart/form-data", // 👈 BẮT BUỘC PHẢI THÊM DÒNG NÀY
            },
          }
        );
        return response.data;
    } catch(error) {
      throw new Error(handleAxiosError(error, 'upfile len server that bai'));
    }
  }
  /*{
    {
    "success": true,
    "message": "File uploaded successfully",
    "data": {
        "originalName": "Minh Họa Cảnh Biển Vào Ban đêm Với đá Và Trăng Tròn _ Nhiếp Ảnh JPG Tải xuống miễn phí - Pikbest.jpg",
        "fileName": "Minh Họa Cảnh Biển Vào Ban đêm Với đá Và Trăng Tròn _ Nhiếp Ảnh JPG Tải xuống miễn phí - Pikbest_1762426728902.jpg",
        "mimeType": "image/jpeg",
        "size": 45469,
        "path": "/uploads/Minh Họa Cảnh Biển Vào Ban đêm Với đá Và Trăng Tròn _ Nhiếp Ảnh JPG Tải xuống miễn phí - Pikbest_1762426728902.jpg"
    }
}
}*/ 
};



export default uploadService;
