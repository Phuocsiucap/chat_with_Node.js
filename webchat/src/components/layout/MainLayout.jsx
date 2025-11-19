import React, { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const { chatId } = useParams();
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // 🧭 Theo dõi kích thước màn hình
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleChange = () => setIsDesktop(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 🔧 Resize Sidebar (desktop)
  const startResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setSidebarWidth(Math.max(200, Math.min(600, newWidth)));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // 🎬 Animation Sidebar
  const sidebarVariants = {
    visible: { x: 0, opacity: 1 },
    hidden: { x: '-10%', opacity: 0 },
  };

  return (
    <div className="relative h-screen bg-gray-50 overflow-hidden">
      {/* ✅ AnimatePresence để ẩn sidebar thực sự sau khi animation kết thúc */}
      <AnimatePresence>
        {(isDesktop || !chatId) && (
          <motion.div
            key="sidebar"
            className="absolute inset-y-0 left-0 h-full bg-white border-r border-gray-200 z-10 shadow-sm"
            style={{
              width: isDesktop ? `${sidebarWidth}px` : '100%',
              pointerEvents: chatId && !isDesktop ? 'none' : 'auto',
            }}
            variants={sidebarVariants}
            initial="visible"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔧 Thanh kéo resize chỉ có trên desktop */}
      {isDesktop && (
        <div
          className="absolute top-0 bottom-0 w-1 bg-gray-200 cursor-col-resize z-20 hover:bg-blue-300 transition-colors"
          style={{ left: `${sidebarWidth}px` }}
          onMouseDown={startResize}
        />
      )}

      {/* Nội dung chính */}
      <motion.main
        className="absolute inset-0 flex flex-col z-0"
        style={{
          left: isDesktop ? `${sidebarWidth}px` : 0,
          right: 0,
        }}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default MainLayout;
