import React, { useState, useEffect } from 'react';
import { X, User, Bell, Image, FileText, Link, Shield, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import chatInfoService from '../../services/chatInfoService';

const ChatInfoPanel = ({ chat, onClose, isMobile = false }) => {
  const [chatInfo, setChatInfo] = useState(null);
  const [sharedMedia, setSharedMedia] = useState([]);
  const [sharedFiles, setSharedFiles] = useState([]);
  const [sharedLinks, setSharedLinks] = useState([]);
  const [loading, setLoading] = useState({
    info: true,
    media: false,
    files: false,
    links: false,
  });
  const [pagination, setPagination] = useState({
    media: { hasMore: true, page: 1 },
    files: { hasMore: true, page: 1 },
    links: { hasMore: true, page: 1 },
  });
  const [expandedSections, setExpandedSections] = useState({
    media: false,
    files: false,
    links: false,
  });
  
  if (!chat) return null;

  // Tải thông tin chat khi component mount
  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        setLoading(prev => ({ ...prev, info: true }));
        const response = await chatInfoService.getChatInfo(chat.id);
        if (response.success) {
          setChatInfo(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin chat:', error);
      } finally {
        setLoading(prev => ({ ...prev, info: false }));
      }
    };

    if (chat?.id) {
      fetchChatInfo();
    }
  }, [chat?.id]);

  // Hàm tải media
  const loadMedia = async (loadMore = false) => {
    if (loading.media) return;
    
    try {
      setLoading(prev => ({ ...prev, media: true }));
      const page = loadMore ? pagination.media.page + 1 : 1;
      const response = await chatInfoService.getSharedMedia(chat.id, page);
      
      if (response.success) {
        const newMedia = response.data.media;
        setSharedMedia(prev => loadMore ? [...prev, ...newMedia] : newMedia);
        setPagination(prev => ({
          ...prev,
          media: {
            hasMore: response.data.pagination.hasMore,
            page: response.data.pagination.currentPage,
          }
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải media:', error);
    } finally {
      setLoading(prev => ({ ...prev, media: false }));
    }
  };

  // Hàm tải files
  const loadFiles = async (loadMore = false) => {
    if (loading.files) return;
    
    try {
      setLoading(prev => ({ ...prev, files: true }));
      const page = loadMore ? pagination.files.page + 1 : 1;
      const response = await chatInfoService.getSharedFiles(chat.id, page);
      
      if (response.success) {
        const newFiles = response.data.files;
        setSharedFiles(prev => loadMore ? [...prev, ...newFiles] : newFiles);
        setPagination(prev => ({
          ...prev,
          files: {
            hasMore: response.data.pagination.hasMore,
            page: response.data.pagination.currentPage,
          }
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải files:', error);
    } finally {
      setLoading(prev => ({ ...prev, files: false }));
    }
  };

  // Hàm tải links
  const loadLinks = async (loadMore = false) => {
    if (loading.links) return;
    
    try {
      setLoading(prev => ({ ...prev, links: true }));
      const page = loadMore ? pagination.links.page + 1 : 1;
      const response = await chatInfoService.getSharedLinks(chat.id, page);
      
      if (response.success) {
        const newLinks = response.data.links;
        setSharedLinks(prev => loadMore ? [...prev, ...newLinks] : newLinks);
        setPagination(prev => ({
          ...prev,
          links: {
            hasMore: response.data.pagination.hasMore,
            page: response.data.pagination.currentPage,
          }
        }));
      }
    } catch (error) {
      console.error('Lỗi khi tải links:', error);
    } finally {
      setLoading(prev => ({ ...prev, links: false }));
    }
  };

  // Hàm toggle section và lazy load
  const toggleSection = async (section) => {
    const isExpanding = !expandedSections[section];
    
    setExpandedSections(prev => ({
      ...prev,
      [section]: isExpanding
    }));

    // Nếu đang expand và chưa có data, tải data
    if (isExpanding) {
      switch (section) {
        case 'media':
          if (sharedMedia.length === 0) await loadMedia();
          break;
        case 'files':
          if (sharedFiles.length === 0) await loadFiles();
          break;
        case 'links':
          if (sharedLinks.length === 0) await loadLinks();
          break;
      }
    }
  };

  // Helper function để format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Helper function để format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      <div className={`
        bg-white flex flex-col overflow-hidden transition-transform duration-300
        ${isMobile 
          ? 'fixed top-0 right-0 bottom-0 w-full max-w-sm shadow-2xl z-50' 
          : 'w-96 border-l border-gray-200 h-full flex-shrink-0'
        }
      `}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Thông tin</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200 text-center">
          {loading.info ? (
            <div className="animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 rounded mb-2 mx-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 mx-8"></div>
            </div>
          ) : (
            <>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-3xl mx-auto mb-3 ${
                chat.isGroup ? 'bg-blue-500' : 'bg-gray-400'
              }`}>
                {chat.avatar}
              </div>
              <h4 className="font-semibold text-xl text-gray-900 mb-1">{chat.name}</h4>
              <p className="text-sm text-gray-500 mb-3">
                {chat.online ? 'Đang hoạt động' : 'Offline'}
              </p>
              {!chat.isGroup && chatInfo && (
                <>
                  <p className="text-sm text-gray-600 mb-1">
                    {chatInfo.participants?.find(p => p._id !== chat.currentUserId)?.email || 'Chưa có email'}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    Tham gia từ {formatDate(chatInfo.participants?.find(p => p._id !== chat.currentUserId)?.createdAt)}
                  </p>
                </>
              )}
              {chat.isGroup && chatInfo && (
                <p className="text-sm text-gray-600">{chatInfo.participants?.length || 0} thành viên</p>
              )}
              {chatInfo && (
                <p className="text-xs text-gray-400 mt-2">
                  {chatInfo.messageCount} tin nhắn
                </p>
              )}
            </>
          )}
        </div>

        {/* Options Section */}
        <div className="border-b border-gray-200">
          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition">
            <Bell size={20} className="text-gray-600" />
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Tắt thông báo</div>
              <div className="text-xs text-gray-500">Tắt thông báo từ cuộc trò chuyện này</div>
            </div>
          </button>
        </div>

        {/* Shared Media */}
        <div className="border-b border-gray-200">
          <button 
            onClick={() => toggleSection('media')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Image size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">Ảnh đã chia sẻ</span>
              {loading.media && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
            </div>
            {expandedSections.media ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.media && (
            <div className="px-4 pb-4">
              {sharedMedia.length > 0 ? (
                <>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {sharedMedia.slice(0, 8).map(media => (
                      <div key={media._id} className="aspect-square rounded overflow-hidden bg-gray-200">
                        <img 
                          src={`http://localhost:5000${media.filePath}`} 
                          alt={media.originalFileName}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80" 
                          onClick={() => window.open(`http://localhost:5000${media.filePath}`, '_blank')}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ELỗi%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {pagination.media.hasMore && (
                    <button 
                      onClick={() => loadMedia(true)}
                      disabled={loading.media}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 py-2 disabled:opacity-50"
                    >
                      {loading.media ? 'Loading...' : 'Xem thêm'}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có ảnh nào</p>
              )}
            </div>
          )}
        </div>

        {/* Shared Files */}
        <div className="border-b border-gray-200">
          <button 
            onClick={() => toggleSection('files')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">Tệp đã chia sẻ</span>
              {loading.files && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
            </div>
            {expandedSections.files ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.files && (
            <div className="px-4 pb-4">
              {sharedFiles.length > 0 ? (
                <>
                  <div className="space-y-2 mb-3">
                    {sharedFiles.map(file => (
                      <div key={file._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center">
                          <FileText size={20} className="text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{file.originalFileName}</div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                            {file.sender && (
                              <> • {file.sender.name}</>
                            )}
                          </div>
                        </div>
                        <a 
                          href={`http://localhost:5000${file.filePath}`}
                          download={file.originalFileName}
                          className="text-blue-600 hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                  {pagination.files.hasMore && (
                    <button 
                      onClick={() => loadFiles(true)}
                      disabled={loading.files}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 py-2 disabled:opacity-50"
                    >
                      {loading.files ? 'Loading...' : 'Xem thêm'}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có file nào</p>
              )}
            </div>
          )}
        </div>

        {/* Shared Links */}
        <div className="border-b border-gray-200">
          <button 
            onClick={() => toggleSection('links')}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Link size={20} className="text-gray-600" />
              <span className="font-medium text-gray-900">Liên kết đã chia sẻ</span>
              {loading.links && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
            </div>
            {expandedSections.links ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.links && (
            <div className="px-4 pb-4">
              {sharedLinks.length > 0 ? (
                <>
                  <div className="space-y-2 mb-3">
                    {sharedLinks.map(linkMessage => (
                      <div key={linkMessage._id} className="p-2 hover:bg-gray-50 rounded">
                        <div className="text-xs text-gray-500 mb-1">
                          {linkMessage.sender?.name} • {formatDate(linkMessage.createdAt)}
                        </div>
                        <div className="text-sm text-gray-700 mb-2 line-clamp-2">
                          {linkMessage.messageContent}
                        </div>
                        <div className="space-y-1">
                          {linkMessage.urls.map((url, index) => (
                            <a 
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 block truncate"
                            >
                              {url}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {pagination.links.hasMore && (
                    <button 
                      onClick={() => loadLinks(true)}
                      disabled={loading.links}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 py-2 disabled:opacity-50"
                    >
                      {loading.links ? 'Loading...' : 'Xem thêm'}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có liên kết nào</p>
              )}
            </div>
          )}
        </div>

        {/* Privacy & Support */}
        <div className="border-b border-gray-200">
          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition">
            <Shield size={20} className="text-gray-600" />
            <span className="font-medium text-gray-900">Bảo mật & Quyền riêng tư</span>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="p-4">
          <button className="w-full p-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded transition">
            <Trash2 size={20} />
            <span className="font-medium">Xóa cuộc trò chuyện</span>
          </button>
        </div>

        {/* Info Footer */}
        <div className="p-4 text-center text-xs text-gray-400 border-t border-gray-200">
          {chatInfo ? (
            `Cuộc trò chuyện được tạo vào ${formatDate(chatInfo.createdAt)}`
          ) : (
            'Loading...'
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default ChatInfoPanel;
