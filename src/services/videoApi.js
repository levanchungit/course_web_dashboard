import axios from 'axios';
import { getToken, getRefreshToken, setTokens } from "../configs/authConfig"
import { BASE_URL } from '@/constants/basic';

const getVideos = async (limit, page, sort) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/videos?limit=${limit}&page=${page}&sort=${sort}`,{
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

const getVideo = async (_id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/videos/${_id}`,{
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

const autoInsertVideosYoutube = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/videos/autoInsertVideosYoutube`,
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
        const newTokenResponse = await axios.course(`${BASE_URL}/api/auth/refresh_token`, {
          refresh_token: getRefreshToken(),
        });

        setTokens(newTokenResponse.data.accessToken, newTokenResponse.data.refreshToken);

        const retryResponse = await axios.course(`${BASE_URL}`, courseData, {
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
    throw error;
  }
};



export { getVideos, getVideo, autoInsertVideosYoutube};
