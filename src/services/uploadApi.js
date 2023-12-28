import axios from 'axios';
import { BASE_URL } from '@/constants/basic';
import { getToken } from '@/configs/authConfig';

const uploadSingle = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/upload/single`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error.response;
  }
};


export { uploadSingle };
