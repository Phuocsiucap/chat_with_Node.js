import React, { useMemo } from 'react';
import { useChat } from '../../hooks/useChat';
import { useNavigate, useParams } from 'react-router-dom';

const ConversationItem = ({ conv, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 p-4 cursor-pointer transition rounded-lg ${
        isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'
      }`}
    >
      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
        conv.isGroup ? 'bg-blue-500' : 'bg-gray-400'
      }`}>
        {conv.avatar}
        {conv.online && !conv.isGroup && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-gray-900 truncate">{conv.name}</span>
          <span className="text-xs text-gray-500">{conv.time}</span>
        </div>
        <p className={`text-sm truncate ${conv.unread > 0 ? 'text-gray-900 font-bold' : 'text-gray-600'}`}>
          {conv.lastMessage}
        </p>
      </div>
      {conv.unread > 0 && (
        <div className="bg-blue-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
          {conv.unread}
        </div>
      )}
    </div>
  );
};

const ConversationList = ({ searchQuery }) => {
  const { conversations, selectChat, loading } = useChat();
  const navigate = useNavigate();
  const { chatId } = useParams(); // Đọc chatId từ URL

  // Lọc danh sách conversations dựa trên searchQuery
  const filteredConversations = useMemo(() => {
    if (!searchQuery) {
      return conversations;
    }
    return conversations.filter(conv =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const handleSelectChat = (convId) => {
    selectChat(convId);
    navigate(`/chat/${convId}`);
  };

  if (loading && conversations.length === 0) {
    return <div className="p-4 text-center text-gray-500">Đang tải...</div>;
  }

  if (filteredConversations.length === 0) {
    return <div className="p-4 text-center text-gray-500">Không tìm thấy.</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {filteredConversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conv={conv}
          isSelected={chatId === conv.id} 
          onSelect={() => handleSelectChat(conv.id)}
        />
      ))}
    </div>
  );
};

export default ConversationList;