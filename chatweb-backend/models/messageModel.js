import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'video', 'audio'],
      default: 'text',
    },
    filePath: {
      type: String,
    },
    originalFileName: {
      type: String,
    },
    mimeType: {
      type: String,
    },
    size : {
      type: Number
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Loại bỏ các field file nếu type === 'text'
        if (ret.type === 'text') {
          delete ret.filePath;
          delete ret.originalFileName;
          delete ret.mimeType;
          delete ret.size;
        }
        return ret;
      },
    },
  }
);

export default mongoose.model('Message', messageSchema);
