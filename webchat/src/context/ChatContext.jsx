import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import chatService from '../services/chatService'; // Sử dụng service
import uploadService from '../services/uploadService';
import { transformConversations, transformConversation } from '../utils/chatTransform';
import { transformMessages, transformMessage } from '../utils/messageTransform';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({}); // { chatId: [...] }
  const [selectedChat, setSelectedChat] = useState(null);
  // { chatId: { hasMore: true, nextPage: 2, isLoading: false } }
  const [paginationInfo, setPaginationInfo] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const socket = useSocket();

  // 1. Tải danh sách cuộc trò chuyện ban đầu
  useEffect(() => {
    console.log(user);
    if (user) {
    // if (user && socket) {
      
      setLoading(true);
      const fetchConversations = async() => {
        try {
          const response = await chatService.getConversations();
          if(response.success) {
            setConversations(transformConversations(response.data, user._id));
          }
          
          console.log("load conversation:", response);
        } catch(err) {
          console.error("Không thể tải conversations:", err)
        } finally {
          setLoading(false)
        }
      }
      
     fetchConversations();
    }
  }, [user, socket]); // Chạy khi user & socket sẵn sàng

  // 2. Lắng nghe tin nhắn mới từ socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {

      const { chatId } = newMessage;
      console.log("received message:", newMessage);
      const messageTransform = transformMessage(newMessage, user._id);
      
      // Cập nhật state tin nhắn
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), messageTransform]
      }));

      // Cập nhật state cuộc trò chuyện (lastMessage, time...)
      setConversations(prev => prev.map(conv => 
        conv.id === chatId 
          ? { ...conv, lastMessage: messageTransform.text, time: messageTransform.time, unread: conv.id === selectedChat ? 0 : conv.unread + 1 }
          : conv
      ));
    };
    // console.log("Before on newMessage:", socket.listeners("message:received").length);
    socket.on('message:received', handleNewMessage);
    socket.on("user:status", handleUserStatus);
    // console.log("Before on newMessage:", socket.listeners("message:received").length);
    return () =>{
      socket.off('message:received', handleNewMessage);
      socket.off("user:status", handleUserStatus);
    } 
  }, [socket, selectedChat]);

  // 3. Hàm chọn chat
  const selectChat = useCallback(async (chatId) => {
    setSelectedChat(chatId);
    console.log("chat selected: ", chatId);

    setConversations(prev => prev.map(conv =>
      conv.id === chatId ? { ...conv, unread: 0 } : conv
    ));

    // Tải tin nhắn cho chat này nếu chưa có
    if (!messages[chatId] && chatId) {
      setLoading(true); // Dùng loading ban đầu
      try {
        // chatService.getMessages giờ trả về { messages, hasMore, next }
        let data = await chatService.getMessages(chatId, 1); // Luôn tải trang 1
        let chatMessagesTransfrom = transformMessages(data.data.messages, user._id);

        console.log(chatMessagesTransfrom);
        setMessages(prev => ({ ...prev, [chatId]: chatMessagesTransfrom }));

        // Lưu thông tin phân trang
        setPaginationInfo(prev => ({
          ...prev,
          [chatId]: {
            hasMore: data.data.hasMore,
            nextPage: data.data.hasMore ? 2 : null, // Trang tiếp theo là 2
            isLoading: false
          }
        }));

      } catch (err) {
        console.error("Không thể tải messages:", err);
      } finally {
        setLoading(false);
      }
    }
  }, [messages, user]);

  // 4. Hàm gửi tin nhắn
  const sendMessage = (text, chatId, files) => {
    if ( !chatId || !user) return;

    const newMessage = {
      id: Date.now(),
      senderId: user._id,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      chatId: chatId
    };
    if (files.length >0) {
      
      console.log("demo send files: ", files);
      handleSendFiles(files, chatId);
    }
    if (text.trim()) {
      socket.emit( "message:send", {
        chatId: chatId,
        senderId: user._id,
        content: text
      });
    }
    
    
    // setMessages(prev => ({
    //   ...prev,
    //   [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    // }));

    // setConversations(prev => prev.map(conv => 
    //   conv.id === selectedChat 
    //     ? { ...conv, lastMessage: text, time: newMessage.time }
    //     : conv
    // ));
  };
  
  //5. ham load them tin nhan
  const loadMoreMessages = async (chatId) => {
    const pagination = paginationInfo[chatId];

    // Kiểm tra nếu không còn tin nhắn, hoặc đang tải
    if (!pagination || !pagination.hasMore || pagination.isLoading) {
      return;
    }

    // Đánh dấu đang tải
    setPaginationInfo(prev => ({
      ...prev,
      [chatId]: { ...pagination, isLoading: true }
    }));

    try {
      const data = await chatService.getMessages(chatId, pagination.nextPage);
      const olderMessages = transformMessages(data.data.messages, user._id);

      // Thêm tin nhắn cũ vào ĐẦU mảng
      setMessages(prev => ({
        ...prev,
        [chatId]: [...olderMessages, ...(prev[chatId] || [])]
      }));

      // Cập nhật pagination
      setPaginationInfo(prev => ({
        ...prev,
        [chatId]: {
          hasMore: data.data.hasMore,
          nextPage: data.data.hasMore ? pagination.nextPage + 1 : null,
          isLoading: false
        }
      }));

    } catch (err) {
      console.error("Không thể tải thêm tin nhắn:", err);
      // Reset loading state khi lỗi
      setPaginationInfo(prev => ({
        ...prev,
        [chatId]: { ...pagination, isLoading: false }
      }));
    }
  };

  //6.ham tao 1 cuoc tro chuyen moi
  const createConversation = async (userId) => {
    try {
      const response = await chatService.createConversation(userId);
      if (response.success) {
        const newConv = transformConversation(response.data, user._id);
        
        // Thêm conversation mới vào danh sách
        setConversations(prev => [newConv, ...prev]);
        
        // Tự động select conversation mới
        setSelectedChat(newConv.id);
        
        // Navigate tới chat mới (nếu cần thiết, có thể làm ở component)
        // Hoặc trả về conversation để component xử lý
        return newConv;
      }
    } catch (error) {
      console.error("Không thể tạo conversation:", error);
      throw error;
    }
  }

  // 7 ham xủ lý gửi file
  const handleSendFiles = async (files, chatId) => {
    try {
      const uploadResults = await Promise.all(
        files.map(file => uploadService.upload(file))
      )
      console.log("result of upload", uploadResults);

      //get info from server
      const uploadedFiles = uploadResults.map(res => res.data);
      // send file as a message
      uploadedFiles.forEach(
        fileData => {
          const message = {
            path: fileData.path,
            originalFileName: fileData.originalName,
            mimeType: fileData.mimeType,
            size: fileData.size
          }
          socket.emit("message:send", {
            chatId: chatId,
            senderId: user._id,
            dataFile: message,
          })
        }
      )
    } catch(error) {
      console.error("Lỗi upload file:", error);
    }
    
  }

  //8 update status user
  const handleUserStatus = (msg) => {
    const { userId, isOnline } = msg;
    console.log(msg);
    setConversations((prev) =>
      prev.map((chat) => {
        // Chỉ update những chat có đúng 2 participants (chat 1-1)
        if (chat.participants.length === 2) {
          return {
            ...chat,
            participants: chat.participants.map((user) =>
              user._id === userId
                ? { ...user, isOnline } // ✅ Update isOnline cho đúng user
                : user
            ),
          };
        }

        return chat;
      })
    );
  };


  const value = {
    conversations,
    messages,
    selectedChat,
    loading,
    selectChat,
    sendMessage,
    getChatById: (chatId) => conversations.find(c => c.id === chatId),
    getMessagesByChatId: (chatId) => messages[chatId] || [],
    createConversation,

    loadMoreMessages,
    getPaginationInfo: (chatId) => paginationInfo[chatId] || { hasMore: false, isLoading: false, nextPage: null },
    handleUserStatus,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

// Hook sẽ được tạo ở file riêng
// export const useChat = () => useContext(ChatContext);
