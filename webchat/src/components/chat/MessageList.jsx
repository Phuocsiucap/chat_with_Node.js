import React, { useRef, useLayoutEffect } from 'react';
import Message from './Message';
// Đảm bảo bạn import đúng đường dẫn tới hook
import useAutoScroll from '../../hooks/useAutoScroll'; 

/**
 * Component hiển thị danh sách tin nhắn.
 * Quản lý cả việc cuộn để tải tin cũ (scroll-up)
 * và tự động cuộn khi có tin mới (scroll-down).
 */

// 1. Thêm 'chatId' vào danh sách props
const MessageList = ({ messages = [], chat, onLoadMore, hasMore, isLoadingMore, chatId }) => {
  const listRef = useRef(null); // Ref cho chính container cuộn
  const prevScrollHeightRef = useRef(null); // Ref để giữ vị trí cuộn
  
  // 2. Truyền 'listRef', 'messages', và 'chatId' vào hook useAutoScroll
  // Hook này giờ sẽ xử lý 3 việc:
  // - Cuộn xuống khi MỚI vào chat (nhờ chatId)
  // - Cuộn xuống khi có tin nhắn mới (nếu ở cuối)
  // - Cuộn xuống khi tự mình gửi
  const messagesEndRef = useAutoScroll(listRef, messages, chatId); 

  // Xử lý sự kiện cuộn (để tải tin nhắn cũ)
  const handleScroll = () => {
    if (listRef.current) {
      const { scrollTop } = listRef.current;
      
      // Nếu cuộn lên đỉnh, còn tin nhắn, và không đang tải
      if (scrollTop === 0 && hasMore && !isLoadingMore) {
        // Lưu scrollHeight hiện tại TRƯỚC KHI load
        prevScrollHeightRef.current = listRef.current.scrollHeight;
        onLoadMore(); // Gọi hàm tải thêm từ context
      }
    }
  };

  // Logic "đứng yên" (giữ vị trí cuộn) khi load tin cũ
  // Chạy sau khi DOM cập nhật nhưng trước khi trình duyệt render
  useLayoutEffect(() => {
    // Chỉ chạy khi `prevScrollHeightRef` có giá trị (tức là ta vừa load tin cũ)
    if (prevScrollHeightRef.current && listRef.current) {
      const newScrollHeight = listRef.current.scrollHeight;
      
      // Set lại scrollTop để giữ vị trí: (Chiều cao mới - Chiều cao cũ)
      listRef.current.scrollTop = newScrollHeight - prevScrollHeightRef.current;
      
      // Reset ref
      prevScrollHeightRef.current = null;
    }
  }, [messages]); // Chạy mỗi khi `messages` thay đổi

  return (
    <div
      ref={listRef}
      onScroll={handleScroll} // Thêm sự kiện onScroll
      className="flex-1 overflow-y-auto p-6 bg-gray-50"
    >
      {/* Hiển thị loading indicator ở trên cùng */}
      {isLoadingMore && (
        <div className="text-center p-4 text-gray-500 text-sm">
          Đang tải tin nhắn cũ hơn...
        </div>
      )}

      {/* Danh sách tin nhắn */}
      {messages.map((msg) => (
        <Message
          key={msg.id}
          msg={msg}
          chat={chat}
        />
      ))}
      
      {/* Ref rỗng để đánh dấu cuối danh sách (cho useAutoScroll) */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;