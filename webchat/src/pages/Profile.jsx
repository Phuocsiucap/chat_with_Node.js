import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Camera, 
  Lock, 
  Mail, 
  Save, 
  X, 
  Trash2, 
  Eye, 
  EyeOff,
  ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';
import { getFullUrl } from '../services/api';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // States cho form data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [deletePassword, setDeletePassword] = useState('');
  
  // States cho UI
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    avatar: false,
    delete: false,
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    delete: false,
  });
  
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load profile data khi component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await profileService.getProfile();
        if (response.success) {
          const userData = response.data;
          setProfileData({
            name: userData.name || '',
            email: userData.email || '',
          });
        }
      } catch (error) {
        setErrors({ general: error.message });
      }
    };
    
    loadProfile();
  }, []);

  // Handle form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle avatar selection
  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({ avatar: 'Vui lòng chọn file ảnh' });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ avatar: 'File không được vượt quá 5MB' });
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Upload avatar
      uploadAvatar(file);
    }
  };

  // Update profile info
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, profile: true }));
    setErrors({});
    
    try {
      const response = await profileService.updateProfile(profileData);
      if (response.success) {
        updateUser(response.data); // Cập nhật user context
        setSuccess('Cập nhật thông tin thành công!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setErrors({ profile: error.message });
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  // Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, password: true }));
    setErrors({});
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp' });
      setLoading(prev => ({ ...prev, password: false }));
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setErrors({ newPassword: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      setLoading(prev => ({ ...prev, password: false }));
      return;
    }
    
    try {
      const response = await profileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      if (response.success) {
        setSuccess('Đổi mật khẩu thành công!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setErrors({ password: error.message });
    } finally {
      setLoading(prev => ({ ...prev, password: false }));
    }
  };

  // Upload avatar
  const uploadAvatar = async (file) => {
    setLoading(prev => ({ ...prev, avatar: true }));
    setErrors({});
    
    try {
      const response = await profileService.updateAvatar(file);
      console.log('Avatar upload response:', response);
      if (response.success) {
        updateUser(response.data); // Cập nhật user context với avatar mới
        setSuccess('Cập nhật avatar thành công!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setErrors({ avatar: error.message });
      setAvatarPreview(null);
    } finally {
      setLoading(prev => ({ ...prev, avatar: false }));
    }
  };

  // Remove avatar
  const handleRemoveAvatar = async () => {
    setLoading(prev => ({ ...prev, avatar: true }));
    
    try {
      const response = await profileService.removeAvatar();
      if (response.success) {
        updateUser(response.data); // Cập nhật user context
        setSuccess('Xóa avatar thành công!');
        setAvatarPreview(null);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setErrors({ avatar: error.message });
    } finally {
      setLoading(prev => ({ ...prev, avatar: false }));
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setLoading(prev => ({ ...prev, delete: true }));
    setErrors({});
    
    try {
      const response = await profileService.deleteAccount(deletePassword);
      if (response.success) {
        logout();
        navigate('/login');
      }
    } catch (error) {
      setErrors({ delete: error.message });
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
      setShowDeleteModal(false);
      setDeletePassword('');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/chat')}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Avatar Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Avatar</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {avatarPreview || user?.avatar ? (
                    <img
                      src={avatarPreview || getFullUrl(user.avatar)}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-gray-400" />
                  )}
                </div>
                {loading.avatar && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading.avatar}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Camera size={16} />
                  Thay đổi avatar
                </button>
                {user?.avatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={loading.avatar}
                    className="text-red-600 hover:text-red-700 px-4 py-2"
                  >
                    Xóa avatar
                  </button>
                )}
              </div>
            </div>
            {errors.avatar && (
              <p className="text-red-600 text-sm mt-2">{errors.avatar}</p>
            )}
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              {errors.profile && (
                <p className="text-red-600 text-sm">{errors.profile}</p>
              )}
              
              <button
                type="submit"
                disabled={loading.profile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={16} />
                {loading.profile ? 'Đang lưu...' : 'Lưu thông tin'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.current ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.new ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
              
              <button
                type="submit"
                disabled={loading.password}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Lock size={16} />
                {loading.password ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Vùng nguy hiểm</h2>
            <p className="text-gray-600 mb-4">
              Một khi bạn xóa tài khoản, bạn sẽ mất tất cả dữ liệu và không thể khôi phục.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <Trash2 size={16} />
              Xóa tài khoản
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận xóa tài khoản</h3>
            <p className="text-gray-600 mb-4">
              Nhập mật khẩu của bạn để xác nhận xóa tài khoản. Hành động này không thể hoàn tác.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPasswords.delete ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('delete')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {showPasswords.delete ? (
                    <EyeOff size={16} className="text-gray-400" />
                  ) : (
                    <Eye size={16} className="text-gray-400" />
                  )}
                </button>
              </div>
              {errors.delete && (
                <p className="text-red-600 text-sm mt-1">{errors.delete}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setErrors({});
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading.delete || !deletePassword}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading.delete ? 'Đang xóa...' : 'Xóa tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;