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

const createCategory = async (postData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/categories`, postData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const newTokenResponse = await axios.post(`${BASE_URL}/api/auth/refresh_token`, {
          refresh_token: getRefreshToken(),
        });

        setTokens(newTokenResponse.data.accessToken, newTokenResponse.data.refreshToken);

        const retryResponse = await axios.post(`${BASE_URL}`, postData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        return retryResponse.data;
      } catch (refreshError) {
        console.log('Error refreshing token:', refreshError);
        throw error.response;
        
      }
    }

    console.log('API Error:', error);
    throw error.response;
  }
};

const updateCategory = async (_id, postData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/admin/categories/${_id}`, postData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const newTokenResponse = await axios.post(`${BASE_URL}/api/auth/refresh_token`, {
          refresh_token: getRefreshToken(),
        });

        setTokens(newTokenResponse.data.accessToken, newTokenResponse.data.refreshToken);

        const retryResponse = await axios.post(`${BASE_URL}`, postData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        return retryResponse.data;
      } catch (refreshError) {
        console.log('Error refreshing token:', refreshError);
        throw error.response;
        
      }
    }

    console.log('API Error:', error);
    throw error.response;
  }
};

const getCategory = async (_id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/categories/${_id}`,{
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('API Error:', error);
    throw error.response;
  }
}

const deleteCategory = async (_id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/categories/${_id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('API Error:', error.response);
    throw error.response;
  }
}

export { createCategory, getCategories, getCategory, updateCategory, deleteCategory };