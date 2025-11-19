import api from './api';
import { handleAxiosError } from '../utils/errorHandler';


const userService = {
  async search(NameOrEmail) {
    try {
        const response = await api.get(`/users/search?search=${NameOrEmail}`);
        return response.data;
    } catch(error) {
      throw new Error(handleAxiosError(error, 'Tim kiem that bai'));
    }
  }
  /*{
    "success": true,
    "data": [
        {
            "_id": "690977f1f7d7b9af19dcbd1c",
            "name": "phuocsiucap2",
            "email": "phuocsiucap1@gmail.com",
            "avatar": "",
            "isOnline": false,
            "createdAt": "2025-11-04T03:50:09.489Z",
            "updatedAt": "2025-11-04T03:50:09.489Z",
            "__v": 0
        }
    ]
}*/ 
};



export default userService;
