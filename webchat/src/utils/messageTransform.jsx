
// Helper để format thời gian tin nhắn
const formatMessageTime = (date) => {
  const messageDate = new Date(date);
  return messageDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Transform một message từ MongoDB format sang UI format
export const transformMessage = (message, currentUserId) => {
  const isSent = message.sender._id.toString() === currentUserId.toString();
  
  return {
    id: message._id,
    senderId: message.sender._id,
    senderName: message.sender.name,
    text: message.content,
    time: formatMessageTime(message.createdAt),
    isSent: isSent,
    isRead: message.isRead,
    createdAt: message.createdAt,
    // Thêm các thuộc tính cho file
    type: message.type || 'text', // 'text', 'file'
    filePath: message.filePath,
    mimeType: message.mimeType,
    originalFileName: message.originalFileName,
    size: message.size
  };
};

// Transform mảng messages
export const transformMessages = (messages, currentUserId) => {
  return messages.map(message => transformMessage(message, currentUserId));
};