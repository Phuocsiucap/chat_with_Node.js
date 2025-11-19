import api from './api';
import { handleAxiosError } from '../utils/errorHandler';

const chatInfoService = {
  // Lấy thông tin cơ bản của chat
  async getChatInfo(chatId) {
    try {
      const response = await api.get(`/chat-info/${chatId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi tải thông tin chat'));
    }
  },

  // Lấy ảnh/video đã chia sẻ
  async getSharedMedia(chatId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/chat-info/${chatId}/media`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi tải ảnh/video'));
    }
  },

  // Lấy file đã chia sẻ
  async getSharedFiles(chatId, page = 1, limit = 15) {
    try {
      const response = await api.get(`/chat-info/${chatId}/files`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi tải file'));
    }
  },

  // Lấy link đã chia sẻ
  async getSharedLinks(chatId, page = 1, limit = 15) {
    try {
      const response = await api.get(`/chat-info/${chatId}/links`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi tải link'));
    }
  },
};

export default chatInfoService;