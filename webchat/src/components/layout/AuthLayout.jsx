import React from 'react';
import { Outlet } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex flex-col">
      {/* Header */}
      <div className="flex-none">
        <div className="flex items-center justify-center pt-8 sm:pt-12 pb-4">
          <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mr-2" />
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600">
            ChatConnect
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-sm sm:max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none text-center pb-6 sm:pb-8">
        <p className="text-xs sm:text-sm text-gray-500">
          © 2025 ChatConnect. Kết nối mọi người, mọi lúc.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;