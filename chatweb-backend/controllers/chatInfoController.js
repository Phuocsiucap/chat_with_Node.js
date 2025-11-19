import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import AppError from '../utils/AppError.js';

// Lấy thông tin cơ bản của chat
const getChatInfo = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id,
    }).populate('participants', 'name email avatar isOnline createdAt');

    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    // Đếm số tin nhắn
    const messageCount = await Message.countDocuments({ chatId });

    const chatInfo = {
      _id: chat._id,
      participants: chat.participants,
      isGroup: chat.participants.length > 2,
      messageCount,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };

    res.status(200).json({
      success: true,
      data: chatInfo,
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách ảnh đã chia sẻ trong chat
const getSharedMedia = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Kiểm tra quyền truy cập chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id,
    });

    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    // Lấy tin nhắn có ảnh/video
    const mediaMessages = await Message.find({
      chatId,
      type: 'file',
      mimeType: { $regex: '^(image|video)/', $options: 'i' },
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('filePath originalFileName mimeType size createdAt sender');

    // Đếm tổng số media
    const totalMedia = await Message.countDocuments({
      chatId,
      type: 'file',
      mimeType: { $regex: '^(image|video)/', $options: 'i' },
    });

    const totalPages = Math.ceil(totalMedia / limit);
    const hasMore = page < totalPages;

    res.status(200).json({
      success: true,
      data: {
        media: mediaMessages,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalMedia,
          hasMore,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách file đã chia sẻ trong chat
const getSharedFiles = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Kiểm tra quyền truy cập chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id,
    });

    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    // Lấy tin nhắn có file (không phải ảnh/video)
    const fileMessages = await Message.find({
      chatId,
      type: 'file',
      mimeType: { 
        $not: { $regex: '^(image|video)/', $options: 'i' }
      },
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('filePath originalFileName mimeType size createdAt sender');

    // Đếm tổng số file
    const totalFiles = await Message.countDocuments({
      chatId,
      type: 'file',
      mimeType: { 
        $not: { $regex: '^(image|video)/', $options: 'i' }
      },
    });

    const totalPages = Math.ceil(totalFiles / limit);
    const hasMore = page < totalPages;

    res.status(200).json({
      success: true,
      data: {
        files: fileMessages,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalFiles,
          hasMore,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách link đã chia sẻ trong chat
const getSharedLinks = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    // Kiểm tra quyền truy cập chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id,
    });

    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    // Regex để tìm URL trong content
    const urlRegex = /(https?:\/\/[^\s]+)/gi;

    // Lấy tin nhắn text có chứa link
    const linkMessages = await Message.find({
      chatId,
      type: 'text',
      content: { $regex: urlRegex },
    })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('content createdAt sender');

    // Extract URLs từ content
    const linksWithMetadata = linkMessages.map(msg => {
      const urls = msg.content.match(urlRegex) || [];
      return {
        _id: msg._id,
        messageContent: msg.content,
        urls,
        createdAt: msg.createdAt,
        sender: msg.sender,
      };
    }).filter(item => item.urls.length > 0);

    // Đếm tổng số tin nhắn có link
    const totalLinkMessages = await Message.countDocuments({
      chatId,
      type: 'text',
      content: { $regex: urlRegex },
    });

    const totalPages = Math.ceil(totalLinkMessages / limit);
    const hasMore = page < totalPages;

    res.status(200).json({
      success: true,
      data: {
        links: linksWithMetadata,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalLinkMessages,
          hasMore,
          limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getChatInfo,
  getSharedMedia,
  getSharedFiles,
  getSharedLinks,
};