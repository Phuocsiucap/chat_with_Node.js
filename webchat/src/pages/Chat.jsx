import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';

import ChatHeader from '../components/chat/ChatHeader';
import MessageList from '../components/chat/MessageList';
import ChatInput from '../components/chat/ChatInput';
import ChatInfoPanel from '../components/chat/ChatInfoPanel';

// Màn hình chào
const WelcomeScreen = () => (
  <div className="hidden md:flex flex-1 flex-col h-full">
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">ChatConnect</h3>
        <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</p>
      </div>
    </div>
    <ChatInput disabled={true} /> 
  </div>
);

// Màn hình loading
const LoadingScreen = () => (
  <div className="flex-1 flex flex-col h-full">
     <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Đang tải tin nhắn...</p>
     </div>
     <ChatInput disabled={true} />
  </div>
);

const Chat = () => {
  const { chatId } = useParams();
  const location = useLocation();
  const {
    selectChat,
    sendMessage,
    getChatById,
    getMessagesByChatId,
    loading,
    loadMoreMessages,
    getPaginationInfo,
    createConversation
  } = useChat();
  const navigate = useNavigate();

  // State để lưu draft user (user chưa có conversation)
  const [draftUser, setDraftUser] = useState(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const chatIdNum = chatId && chatId !== 'new' ? chatId : null;

  // Xử lý draft mode
  useEffect(() => {
    // console.log('Chat useEffect - chatId:', chatId);
    // console.log('Location state:', location.state);
    
    if (chatId === 'new' && location.state?.draftUser) {
      // Mode tạo chat mới với user
      console.log('Setting draft user:', location.state.draftUser);
      setDraftUser(location.state.draftUser);
    } else if (chatIdNum) {
      // Mode chat bình thường
      // console.log('Normal chat mode, clearing draft');
      setDraftUser(null);
      selectChat(chatIdNum);
    }
  }, [chatId, chatIdNum, location.state, selectChat]);

  const currentChat = getChatById(chatIdNum);
  const currentMessages = getMessagesByChatId(chatIdNum);
  const pagination = getPaginationInfo(chatIdNum);

  // Hàm xử lý gửi tin nhắn
  const handleSendMessage = async (messageText, files = []) => {
    if (draftUser && !chatIdNum) {
      setIsCreatingChat(true);
      try {
        const newConversation = await createConversation(draftUser._id);
        
        if (newConversation) {
          // Gửi tin nhắn kèm files
          await sendMessage(messageText, newConversation.id, files);
          setDraftUser(null);
          selectChat(newConversation.id);
          navigate(`/chat/${newConversation.id}`);
        }
      } catch (error) {
        console.error('Failed to create conversation:', error);
      } finally {
        setIsCreatingChat(false);
      }
    } else {
      // Gửi tin nhắn kèm files
      await sendMessage(messageText, chatIdNum, files);
    }
  };

  // Trường hợp 1: Draft mode - Chat với user mới
  if (draftUser) {
    console.log('Rendering draft chat for:', draftUser); // Debug log
    
    // Tạo avatar từ chữ cái đầu nếu không có avatar
    const avatarDisplay = draftUser.avatar && draftUser.avatar.trim() !== '' 
      ? draftUser.avatar 
      : draftUser.name.charAt(0).toUpperCase();
    
    const draftChat = {
      name: draftUser.name,
      avatar: avatarDisplay,
      isGroup: false,
      online: draftUser.isOnline || false
    };

    return (
      <div className="flex-1 flex h-screen w-full">
        <div className="flex-1 flex flex-col">
          <ChatHeader 
            chat={draftChat} 
            onToggleInfoPanel={() => setShowInfoPanel(!showInfoPanel)}
            showInfoPanel={showInfoPanel}
          />
          
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  {avatarDisplay}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {draftChat.name}
                </h3>
                <p className="text-gray-500 mb-1">
                  {draftUser.email}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện
                </p>
              </div>
            </div>
          </div>
          
          <ChatInput 
            onSend={handleSendMessage} 
            disabled={isCreatingChat}
            placeholder={isCreatingChat ? "Đang tạo cuộc trò chuyện..." : "Nhập tin nhắn..."}
          />
        </div>
        
        {/* Info Panel bên phải cho draft chat */}
        {showInfoPanel && (
          <ChatInfoPanel 
            chat={draftChat} 
            onClose={() => setShowInfoPanel(false)}
            isMobile={false}
          />
        )}
      </div>
    );
  }

  // Trường hợp 2: Chưa chọn chat (URL là /chat)
  if (!chatIdNum) {
    return <WelcomeScreen />;
  }

  // Trường hợp 3: Đã chọn chat, đang tải lần đầu
  if (loading && currentMessages.length === 0) {
    return <LoadingScreen />;
  }

  // Trường hợp 4: Không tìm thấy chat
  if (!loading && !currentChat) {
    return <WelcomeScreen />;
  }
  
  // Trường hợp 5: Hiển thị chat bình thường
  return (
    <div className="flex-1 flex h-screen w-full">
      <div className={`flex flex-col min-w-0 transition-all duration-300 ${
        showInfoPanel ? 'flex-1' : 'flex-1'
      }`}>
        <ChatHeader 
          chat={currentChat} 
          onToggleInfoPanel={() => setShowInfoPanel(!showInfoPanel)}
          showInfoPanel={showInfoPanel}
        /> 
        
        <MessageList
          messages={currentMessages}
          chat={currentChat}
          onLoadMore={() => loadMoreMessages(chatIdNum)}
          hasMore={pagination.hasMore}
          isLoadingMore={pagination.isLoading}
          chatId={chatIdNum}
        />
        
        <ChatInput onSend={handleSendMessage} />
      </div>
      
      {/* Info Panel bên phải */}
      {showInfoPanel && (
        <ChatInfoPanel 
          chat={currentChat} 
          onClose={() => setShowInfoPanel(false)}
          isMobile={false}
        />
      )}
    </div>
  );
};

export default Chat;