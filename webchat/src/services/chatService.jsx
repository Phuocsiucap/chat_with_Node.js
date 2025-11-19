import api from './api';
import { handleAxiosError } from '../utils/errorHandler';

// Dữ liệu giả lập ban đầu (chuyển từ ChatContext ra)
const initialConversations = [
  { id: 1, name: 'John Smith', avatar: 'JS', lastMessage: 'Thanks for the update!', time: '10:42 AM', unread: 2, online: true, isGroup: false },
  { id: 2, name: 'Tech Team', avatar: 'TT', lastMessage: 'Alex: The new feature is ready', time: '9:30 AM', unread: 0, online: true, isGroup: true },
  { id: 3, name: 'Sarah Wilson', avatar: 'SW', lastMessage: 'Let\'s schedule a call', time: 'Yesterday', unread: 0, online: false, isGroup: false },
  { id: 4, name: 'Mark Brown', avatar: 'MB', lastMessage: 'I\'ve shared the files', time: 'Yesterday', unread: 0, online: true, isGroup: false }
];

const initialMessages = {
  1: [
    { id: 1, senderId: 1, text: 'Hey Robert! How\'s the project?', time: '9:30 AM', isSent: false },
    { id: 2, senderId: 99, text: 'Hi John! It\'s going well.', time: '9:32 AM', isSent: true }, // 99 là placeholder
  ],
  2: [ { id: 1, senderId: 5, text: 'Feature is ready for testing', time: '9:30 AM', isSent: false, senderName: 'Alex' } ],
  3: [],
  4: []
};

const chatService = {
  async getConversations() {
    try {
      const response = await api.get('/chats');
      return response.data;
    } catch(error) {
      throw new Error(handleAxiosError(error, 'lay thong tin thất bại'));
    }
  },

  async getMessages(conversationId, pageToload) {
    const response = await api.get(`/chats/${conversationId}/messages?page=${pageToload}`);
    return response.data;
    // return initialMessages[conversationId] || [];
  },

  


  //tao moi
  async createConversation(userId) {
    try{
      const response = await api.post(`/chats`,{
        userId: userId
      });
      return response.data;
    } catch(error) {
      throw new Error(handleAxiosError(error, "loi khi tao"));
    }
  }
};

export default chatService;