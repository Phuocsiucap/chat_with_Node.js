import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import AppError from '../utils/AppError.js';

const getConversations = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
    })
      .populate('participants', '-password')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    // lay trnag từ query params, mặc định là trang 1 mới nhất
    const page = parseInt(req.query.page) ||1;
    const limit = 50;
    const skip = (page - 1) * limit; // so tin nhan bo qua vi da load truoc do
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id,
    });
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }
    const totalMessages = await Message.countDocuments({chatId});
    const totalPages = Math.ceil(totalMessages/limit);
    const hasMore = page < totalPages;

    const next = hasMore ? `/api/chats/${chatId}/messages?page=${page + 1}` : null;
    

    const messages = await Message.find({ chatId })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    messages.reverse();
    res.status(200).json({
      success: true,
      data: {
        messages,
        hasMore,
        next,
      }
    });
  } catch (error) {
    next(error);
  }
};

const createChat = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new AppError('Please provide userId', 400);
    }

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, userId] },
    }).populate('participants', '-password');

    if (!chat) {
      chat = await Chat.create({
        participants: [req.user._id, userId],
      });
      chat = await chat.populate('participants', '-password');
    }

    res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getConversations,
  getMessages,
  createChat,
};
