// postService.js
import axios from 'axios';
import { getToken, getRefreshToken, setTokens, removeTokens } from "../configs/authConfig"

const BASE_URL = 'http://192.168.1.220:3000';

const createPost = async (postData) => {
  try {
    const response = await axios.post(`${BASE_URL}`, postData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      try {
        const newTokenResponse = await axios.post('your_refresh_token_endpoint', {
          refreshToken: getRefreshToken(),
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
        console.error('Error refreshing token:', refreshError);
      }
    }

    console.error('API Error:', error);
    throw error;
  }
};

export { createPost };
