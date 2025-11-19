import React, { useState, useEffect } from 'react';
import { Phone, Video, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatInfoPanel from './ChatInfoPanel';

const ChatHeader = ({ chat, onToggleInfoPanel, showInfoPanel }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!chat) return null;

  const handleBack = () => {
    navigate('/chat');
  };

  const toggleInfoPanel = () => {
    if (onToggleInfoPanel) {
      onToggleInfoPanel();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      {/* Thông tin User/Nhóm */}
      <div className="flex items-center gap-3">
        {/* Nút back cho mobile */}
        <button 
          onClick={handleBack}
          className="md:hidden p-2 hover:bg-gray-100 rounded-full transition -ml-2"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>

        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
          chat.isGroup ? 'bg-blue-500' : 'bg-gray-400'
        }`}>
          {chat.avatar}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{chat.name}</h3>
          <p className="text-sm text-gray-500">
            {chat.online ? 'Đang hoạt động' : 'Offline'}
          </p>
        </div>
      </div>
      
      {/* Nút hành động */}
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <Phone size={20} className="text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition">
          <Video size={20} className="text-gray-600" />
        </button>
        <button 
          onClick={toggleInfoPanel}
          className={`p-2 hover:bg-gray-100 rounded-full transition ${showInfoPanel ? 'bg-gray-100' : ''}`}
        >
          <Info size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;