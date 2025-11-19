// utils/chatTransform.js

// Helper để format thời gian
const formatTime = (date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMs = now - messageDate;
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 24) {
    // Hôm nay - hiển thị giờ
    return messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else if (diffInDays < 2) {
    // Hôm qua
    return 'Yesterday';
  } else if (diffInDays < 7) {
    // Tuần này - hiển thị tên ngày
    return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
  } else {
    // Lâu hơn - hiển thị ngày tháng
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};

// Helper để tạo avatar từ tên
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Transform một conversation từ MongoDB format sang UI format
export const transformConversation = (chat, currentUserId) => {
  const otherParticipant = chat.participants.find(
    p => p._id.toString() !== currentUserId.toString()
  );

  const isGroup = chat.participants.length > 2;

  return {
    id: chat._id,
    name: isGroup 
      ? chat.name || 'Group Chat'
      : otherParticipant?.name || 'Unknown User',

    avatar: isGroup
      ? chat.avatar || getInitials(chat.name || 'Group')
      : otherParticipant?.avatar || getInitials(otherParticipant?.name || 'U'),

    lastMessage: chat.lastMessage?.content || 'No messages yet',
    time: chat.lastMessage?.createdAt 
      ? formatTime(chat.lastMessage.createdAt)
      : '',
    unread: 0,

    online: isGroup ? false : otherParticipant?.isOnline || false,
    isGroup,

    // ✅ giữ participants
    participants: chat.participants  
  };
};

// Transform mảng conversations
export const transformConversations = (chats, currentUserId) => {
  return chats.map(chat => transformConversation(chat, currentUserId));
};