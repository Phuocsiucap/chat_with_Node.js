import React from 'react';
import { BrowserRouter,HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ChatProvider } from './context/ChatContext';
import { UserProvider } from './context/UserContext';

import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <HashRouter>
          <Routes>
            {/* Các trang không cần đăng nhập (Login, Register) */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Các trang cần đăng nhập */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <SocketProvider>
                    <ChatProvider>
                      <MainLayout />
                    </ChatProvider>
                  </SocketProvider>
                </ProtectedRoute>
              }
            >
              {/* Trang chat (mặc định) */}
              <Route index element={<Navigate to="/chat" replace />} />
              {/* <Route path="/chat/new" element={<Chat />} /> */}
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              
              {/* Trang bạn bè */}
              <Route path="friends" element={<Friends />} />
              
              {/* Trang profile */}
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;