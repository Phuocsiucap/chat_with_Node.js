import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, LogOut, Users, MessageSquare, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import { useChat } from '../../hooks/useChat';
import ConversationList from '../chat/ConversationList';
import { getFullUrl } from '../../services/api';

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user, logout } = useAuth();
  const { search } = useUser();
  const { conversations } = useChat();
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Reset search nếu query trống
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    // Set new debounce
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await search(searchQuery);
        
        // Lọc bỏ những người dùng đã có conversation
        const existingUserIds = conversations
          .filter(conv => !conv.isGroup && conv.participants?.length === 2)
          .flatMap(conv => conv.participants.map(p => p._id));
        
        const filteredResults = (results || []).filter(
          user => !existingUserIds.includes(user._id)
        );
        
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]); // Chỉ phụ thuộc vào searchQuery

  const handleNewChat = () => {
    console.log('Tạo cuộc trò chuyện mới');
  };

  const handleLogout = () => {
    logout();
    console.log('Navigate to login');
  };

  const handleUserClick = (user) => {
    console.log('Start chat with user:', user);
    navigate(`/chat/new`, {
      state: { draftUser: user },
    });
    setSearchQuery('');
  };

  return (
    <div className="w-full h-full bg-white md:border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span className="text-xl font-bold text-blue-600">ChatConnect</span>
        </div>
        <button
          onClick={handleNewChat}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1 text-sm"
        >
          <Plus size={16} />
          <span>Mới</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện hoặc người dùng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {!searchQuery ? (
          <ConversationList searchQuery="" />
        ) : (
          <div className="space-y-4">
            {/* Cuộc trò chuyện */}
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <MessageSquare size={16} className="text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Cuộc trò chuyện</h3>
              </div>
              <ConversationList searchQuery={searchQuery} />
            </div>

            {/* Người dùng */}
            <div>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <Users size={16} className="text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-700">Người dùng</h3>
              </div>

              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm">Đang tìm kiếm...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      onClick={() => handleUserClick(result)}
                      className="p-3 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
                          {result.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {result.name}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {result.email}
                          </div>
                        </div>
                        <Plus size={18} className="text-blue-600 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <Users size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm">Không tìm thấy người dùng</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-3 flex-shrink-0">
        <div 
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer hover:bg-blue-700 transition"
        >
          {user?.avatar ? (
            <img 
              src={getFullUrl(user.avatar)} 
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            user?.name?.charAt(0)?.toUpperCase() || 'U'
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900">{user?.name}</div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Online
          </div>
        </div>
        <button
          onClick={() => navigate('/profile')}
          title="Cài đặt"
          className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
        >
          <Settings size={18} />
        </button>
        <button
          onClick={handleLogout}
          title="Đăng xuất"
          className="text-gray-400 hover:text-red-500 p-1 hover:bg-gray-100 rounded"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
