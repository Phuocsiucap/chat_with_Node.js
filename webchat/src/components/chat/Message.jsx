import React from 'react';
import { getFullUrl } from '../../services/api';
// import { useAuth } from '../../hooks/useAuth';

// Helper để format kích thước file
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Helper để kiểm tra xem file có phải là ảnh không
const isImageFile = (mimeType) => {
  return mimeType && mimeType.startsWith('image/');
};

// Helper để lấy icon cho file
const getFileIcon = (mimeType) => {
  if (!mimeType) return '📄';
  
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📕';
  if (mimeType.includes('word') || mimeType.includes('document')) return '📘';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📗';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📙';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('compressed')) return '📦';
  
  return '📄';
};

const Message = ({ msg, chat }) => {
  const isSent = msg.isSent;
  const isImage = msg.type === 'file' && isImageFile(msg.mimeType);
  const isFile = msg.type === 'file' && !isImage;
  
  // Tạo URL đầy đủ cho file
  const fileUrl = msg.filePath ? getFullUrl(msg.filePath) : null;
  
  return (
    <div className={`flex gap-3 mb-4 ${isSent ? 'flex-row-reverse' : ''}`}>
      {/* Avatar - chỉ hiển thị cho tin nhắn nhận được trong group chat */}
      {!isSent && chat.isGroup && (
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 bg-gray-400">
          {chat.avatar}
        </div>
      )}
      
      {/* Nội dung tin nhắn */}
      <div className={`max-w-md ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Tên người gửi (cho nhóm chat) */}
        {chat.isGroup && !isSent && msg.senderName && (
          <div className="text-xs font-semibold mb-1 opacity-70">{msg.senderName}</div>
        )}
        
        {/* Hiển thị ảnh - không có background wrapper */}
        {isImage && fileUrl && (
          <div>
            <img 
              src={fileUrl} 
              alt={msg.originalFileName || 'Image'}
              className="rounded-xl max-w-xs max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(fileUrl, '_blank')}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        )}
        
        {/* Wrapper cho file và text */}
        <div className={`${isImage ? 'hidden' : ''} rounded-2xl ${
          isSent 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
        }`}>
          
          {/* Hiển thị file không phải ảnh */}
          {isFile && fileUrl && (
            <a 
              href={fileUrl} 
              download={msg.originalFileName}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-4 py-3 hover:opacity-80 transition-opacity ${
                isSent ? 'text-white' : 'text-gray-900'
              }`}
            >
              <span className="text-3xl">{getFileIcon(msg.mimeType)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {msg.originalFileName || 'File'}
                </p>
                {msg.size && (
                  <p className={`text-xs ${isSent ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatFileSize(msg.size)}
                  </p>
                )}
              </div>
              <svg 
                className="w-5 h-5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </a>
          )}
          
          {/* Hiển thị text (nếu có text kèm theo hoặc chỉ có text) */}
          {msg.text && msg.type !== 'file' && (
            <div className="px-4 py-2">
              <p className="text-sm">{msg.text}</p>
            </div>
          )}
        </div>
        
        <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
      </div>
    </div>
  );
};

export default Message;