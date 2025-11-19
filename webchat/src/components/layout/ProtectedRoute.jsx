import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Đảm bảo đường dẫn chính xác

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng về trang login
    // `replace` để ngăn người dùng back lại trang cũ
    // `state` để lưu lại trang họ đang muốn vào,
    // sau khi login ta có thể chuyển họ về trang đó
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Nếu đã đăng nhập, hiển thị component con (MainLayout)
  return children;
};

export default ProtectedRoute;