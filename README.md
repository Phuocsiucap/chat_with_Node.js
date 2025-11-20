"# ChatWeb - Real-time Chat Application

## 📋 Mô tả dự án

ChatWeb là một ứng dụng chat thời gian thực được xây dựng với Node.js, React và Socket.IO. Ứng dụng hỗ trợ chat cá nhân và nhóm, chia sẻ file, hình ảnh với giao diện người dùng hiện đại và responsive.

## ✨ Tính năng chính

### 🚀 Chat thời gian thực
- Tin nhắn tức thời với Socket.IO
- Chat cá nhân và nhóm
- Hiển thị trạng thái online/offline
- Xem tin nhắn đã đọc/chưa đọc

### 📁 Chia sẻ file & media
- Upload và chia sẻ hình ảnh
- Chia sẻ file đa dạng (PDF, DOC, ZIP, v.v.)
- Preview hình ảnh trực tiếp trong chat
- Download file dễ dàng

### 👤 Quản lý người dùng
- Đăng ký và đăng nhập an toàn
- Cập nhật thông tin cá nhân
- Avatar người dùng
- Quản lý danh sách bạn bè

### 🎨 Giao diện hiện đại
- Responsive design
- Dark/Light mode
- Smooth animations với Framer Motion
- UI/UX thân thiện với Tailwind CSS

## 🏗️ Kiến trúc hệ thống

```
ChatWeb/
├── chatweb-backend/     # Backend API Server
│   ├── controllers/     # API Controllers
│   ├── models/         # Database Models
│   ├── routes/         # API Routes
│   ├── middleware/     # Custom Middleware
│   ├── services/       # Business Logic
│   ├── socket/         # Socket.IO Handlers
│   └── config/         # Database & Config
│
└── webchat/            # Frontend React App
    ├── src/
    │   ├── components/  # React Components
    │   ├── pages/      # Page Components
    │   ├── services/   # API Services
    │   ├── hooks/      # Custom Hooks
    │   ├── context/    # React Context
    │   └── utils/      # Utility Functions
    └── public/         # Static Assets
```

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Cloudinary** - File storage
- **Multer** - File upload
- **bcryptjs** - Password hashing

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP Client
- **React Router** - Routing
- **Lucide React** - Icons

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- MongoDB
- npm hoặc yarn

### 1. Clone repository
```bash
git clone https://github.com/Phuocsiucap/chat_with_Node.js.git
cd Chatweb
```

### 2. Cài đặt dependencies

#### Backend
```bash
cd chatweb-backend
npm install
```

#### Frontend
```bash
cd webchat
npm install
```

### 3. Cấu hình environment variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/chatweb

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# Server
PORT=5000

# Cloudinary (for file upload)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Chạy ứng dụng

#### Chạy Backend
```bash
cd chatweb-backend
npm start
# Server sẽ chạy tại http://localhost:5000
```

#### Chạy Frontend
```bash
cd webchat
npm run dev
# Client sẽ chạy tại http://localhost:5173
```

## 📱 Hướng dẫn sử dụng

1. **Đăng ký tài khoản** - Tạo tài khoản mới với email và mật khẩu
2. **Đăng nhập** - Sử dụng thông tin đã đăng ký để truy cập
3. **Tạo hoặc tham gia chat** - Bắt đầu cuộc trò chuyện mới
4. **Gửi tin nhắn** - Chat text, chia sẻ file, hình ảnh
5. **Quản lý profile** - Cập nhật thông tin cá nhân

## 🚀 Deployment

### Backend (Node.js)
```bash
cd chatweb-backend
npm run build
npm start
```

### Frontend (Static hosting)
```bash
cd webchat
npm run build
# Deploy thư mục dist/ lên hosting
```

## 📄 API Documentation

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Users
- `GET /api/users/profile` - Lấy thông tin user
- `PUT /api/users/profile` - Cập nhật profile
- `GET /api/users` - Danh sách users

### Chats
- `GET /api/chats` - Danh sách chat
- `POST /api/chats` - Tạo chat mới
- `GET /api/chats/:id/messages` - Lấy tin nhắn

### Upload
- `POST /api/upload` - Upload file

## 🤝 Đóng góp

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request



## 👨‍💻 Tác giả

- **Phuocsiucap** - [GitHub](https://github.com/Phuocsiucap)



⭐ Nếu dự án hữu ích, hãy cho một star nhé!" 
