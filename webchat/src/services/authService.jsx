import api from './api';
import { handleAxiosError } from '../utils/errorHandler';
// Giả lập dữ liệu user trả về
const mockUser = {
  id: 1,
  name: 'Robert Williams',
  email: 'abc@gmail.com',
  avatar: 'RW'
};
const mockToken = 'mock-jwt-token-12345'; // Giả lập token

const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Đăng nhập thất bại'));
    }
    
  },
/** {
    "success": true,
    "data": {
        "_id": "69079cba0e0b48f785cc2686",
        "name": "phuocsiucap",
        "email": "phuocsiucap@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDc5Y2JhMGUwYjQ4Zjc4NWNjMjY4NiIsImlhdCI6MTc2MjIyODY0OCwiZXhwIjoxNzY0ODIwNjQ4fQ.kmDrioB4UbXqhspD2_f_Zo2xWyCeJUCsrUn2PNRBpbM"
    }
}*/
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error, 'Đăng nhập thất bại'));
    }
    

  },
/* {
    "success": true,
    "data": {
        "_id": "690977f1f7d7b9af19dcbd1c",
        "name": "phuocsiucap2",
        "email": "phuocsiucap1@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MDk3N2YxZjdkN2I5YWYxOWRjYmQxYyIsImlhdCI6MTc2MjIyODIwOSwiZXhwIjoxNzY0ODIwMjA5fQ.H1PkVFpFbIps4_3JSxf3zW98p9soGcwjbG4PDhq-Ino"
    }
}*/


  async logout() {
    localStorage.removeItem('token');
  },
};



export default authService;
