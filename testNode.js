const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  // đăng ký user online
  socket.emit("user:online", "6907a2010e0b48f785cc2699");

  // gửi tin nhắn
  socket.emit("message:send", {
    chatId: "6907a52f0e0b48f785cc26a3",
    senderId: "6907a2010e0b48f785cc2699",
    receiverId: "69079cba0e0b48f785cc2686",
    content: "Hello!"
  });
});

// lắng nghe phản hồi từ server
socket.on("message:received", (msg) => {
  console.log("📩 Server sent message:", msg);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});
