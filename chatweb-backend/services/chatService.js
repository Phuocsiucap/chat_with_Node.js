import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import AppError from '../utils/AppError.js';

const createMessage = async ({ chatId, senderId, content, dataFile }) => {
  // Chuẩn bị dữ liệu để lưu
  const messageData = {
    chatId,
    sender: senderId,
    isRead: false,
  };

  // Nếu có file → gán thông tin file
  // console.log("dataFile: ", dataFile);
  if (dataFile) {
    messageData.type = dataFile.type || 'file';
    messageData.filePath = dataFile.path;
    messageData.originalFileName = dataFile.originalFileName;
    messageData.mimeType = dataFile.mimeType;
    messageData.size = dataFile.size;
    messageData.content = dataFile.path; // Cho phép client render trực tiếp
  } else {
    // Nếu chỉ là text
    messageData.type = 'text';
    messageData.content = content;
  }
  console.log("message cbi creat:", messageData);
  // Lưu message
  const message = await Message.create(messageData);
  console.log("created: ", message); 
  const chat = await Chat.findByIdAndUpdate(chatId, {
    lastMessage: message._id,
    updatedAt: new Date(),
  });

  const messagePopulate = await message.populate('sender', 'name email')
  return {
    message: messagePopulate.toJSON(),
    receiverIds: chat.participants.filter(id => id.toString() !== senderId.toString())
  };
};



export {
  createMessage,

};
