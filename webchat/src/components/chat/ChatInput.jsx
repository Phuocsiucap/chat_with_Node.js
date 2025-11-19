import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, X, File, Image as ImageIcon } from 'lucide-react';

const ChatInput = ({ onSend, disabled = false, placeholder = "Nhập tin nhắn..." }) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (message.trim() || selectedFiles.length > 0) {
      // Gửi cả tin nhắn và files
      onSend(message, selectedFiles);
      setMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon size={16} className="text-blue-500" />;
    }
    return <File size={16} className="text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      {/* Hiển thị files đã chọn */}
      {selectedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm"
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="truncate max-w-[150px] font-medium text-gray-700">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => handleRemoveFile(index)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-center gap-3 bg-gray-100 rounded-3xl px-4 py-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="text-gray-500 hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Paperclip size={20} />
        </button>
        
        <button
          disabled={disabled}
          className="text-gray-500 hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Smile size={20} />
        </button>
        
        <input
          type="text"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="flex-1 bg-transparent border-none outline-none text-sm disabled:cursor-not-allowed"
        />
        
        <button
          onClick={handleSend}
          disabled={(!message.trim() && selectedFiles.length === 0) || disabled}
          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;