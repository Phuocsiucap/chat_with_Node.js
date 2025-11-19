import { createMessage } from '../services/chatService.js';
import User from '../models/userModel.js';
const onlineUsers = new Map();

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('user:online', (userId) => {
      onlineUsers.set(userId, socket.id);
      User.findByIdAndUpdate(userId, { isOnline: true }).catch(err =>
        console.error("🔥 Update status online failed:", err)
      );

      io.emit('user:status', {userId, isOnline: true}); //gui lai su kien cho chinh nguoi ket noi
    })

    socket.on('message:send', async(data) => {
      console.log(data);
      try {
        // const {chatId, content, senderId, dataFile} = data;
        const chatId = data.chatId;
        const content = data.content;
        const senderId = data.senderId;
        const dataFile  = data.dataFile;
        // console.log("data from data: ", dataFile);
        const {message, receiverIds} = await createMessage({chatId, senderId, content, dataFile});
        io.to(socket.id).emit('message:received', message);
        console.log("result", message, receiverIds);
        // Gửi cho các người còn lại trong chat

        receiverIds.forEach(receiverId => {
          const receiverSocketId = onlineUsers.get(receiverId.toString());
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('message:received', message);
            console.log(`Message sent to ${receiverId}`);
          }
        });
      } catch (error) {
        socket.emit('message:error', {message: error.message});
      }
    });

    socket.on('typing:start', (data) => {
      const { receiverId, chatId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:status", {chatId, isTyping: true});
      }
    });

    socket.on('typing:stop', (data) => {
      const { receiverId, chatId } = data;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing:status", {chatId, isTyping: false});
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // ✅ Tìm user có socket.id tương ứng
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          User.findByIdAndUpdate(userId, { isOnline: false }).catch(err =>
            console.error("🔥 Update status offline failed:", err)
          );

          io.emit('user:status', { userId, isOnline: false });
          break;
        }
      }
    });

  });
};



export default initializeSocket;
