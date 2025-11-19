export const handleAxiosError = (error, defaultMessage = 'Có lỗi xảy ra') => {
  if (error.response) {
    // Server trả về lỗi
    return error.response.data?.message || defaultMessage;
  }
  
  if (error.request) {
    // Không nhận được response
    return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối.';
  }
  
  // Lỗi khác
  return error.message || defaultMessage;
};