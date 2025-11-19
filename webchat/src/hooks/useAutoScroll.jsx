import { useRef, useLayoutEffect } from 'react';

/**
 * Một hook "thông minh" để tự động cuộn xuống cuối danh sách.
 * Nó chỉ cuộn nếu người dùng đang ở gần cuối,
 * HOẶC nếu tin nhắn mới là do chính người dùng gửi.
 * * @param {React.RefObject<HTMLElement>} containerRef Ref tới element container có thanh cuộn.
 * @param {Array<Object>} dependency Mảng messages, dùng để kích hoạt effect.
 */
const useAutoScroll = (containerRef, dependency) => {
  const messagesEndRef = useRef(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Lấy tin nhắn cuối cùng để kiểm tra xem có phải do mình gửi không
    const lastMessage = dependency[dependency.length - 1];
    const isMyMessage = lastMessage ? lastMessage.isSent : false;

    // --- Logic kiểm tra vị trí cuộn ---
    // Đặt một ngưỡng (threshold) pixel, ví dụ: 50px
    // Nếu người dùng cuộn cách đáy <= 50px, ta coi là "đang ở cuối"
    const threshold = 50;
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
    
    // Tự động cuộn nếu:
    // 1. Người dùng đang ở cuối (isAtBottom)
    // 2. Hoặc tin nhắn mới nhất là do chính mình gửi (isMyMessage)
    if (isAtBottom || isMyMessage) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

  }, [dependency, containerRef]); // Chạy mỗi khi mảng messages thay đổi

  return messagesEndRef;
};

export default useAutoScroll;