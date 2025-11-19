import api from './api';
import { handleAxiosError } from '../utils/errorHandler';

const profileService = {
  // Lấy thông tin profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi tải thông tin profile'));
    }
  },

  // Cập nhật thông tin cơ bản
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi cập nhật profile'));
    }
  },

  // Thay đổi mật khẩu
  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/password', passwordData);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi thay đổi mật khẩu'));
    }
  },

  // Cập nhật avatar
  async updateAvatar(avatarFile) {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await api.put('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi cập nhật avatar'));
    }
  },

  // Xóa avatar
  async removeAvatar() {
    try {
      const response = await api.delete('/auth/avatar');
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi xóa avatar'));
    }
  },

  // Xóa tài khoản
  async deleteAccount(password) {
    try {
      const response = await api.delete('/auth/account', { data: { password } });
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Lỗi khi xóa tài khoản'));
    }
  },
};

export default profileService;