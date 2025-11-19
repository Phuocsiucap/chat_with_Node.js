import React from 'react';

const Friends = () => {
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 text-lg">Bạn bè</h3>
      </div>
      
      {/* Nội dung */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p>Trang quản lý bạn bè sẽ được xây dựng ở đây.</p>
        </div>
      </div>
    </div>
  );
};

export default Friends;
