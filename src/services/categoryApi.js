import axios from 'axios';
import { getToken, getRefreshToken, setTokens } from "../configs/authConfig"
import { BASE_URL } from '@/constants/basic';

const getCategories = async (limit, page) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/categories?limit=${limit}&page=${page}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log('API Error:', error);
      throw error;
    }
  };

  export { getCategories};