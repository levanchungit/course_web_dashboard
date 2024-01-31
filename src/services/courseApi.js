import axios from 'axios';
import { getToken, getRefreshToken, setTokens } from "../configs/authConfig"
import { BASE_URL } from '@/constants/basic';

const createCourse = async (courseData) => {
  try {
    const response = await axios.course(`${BASE_URL}/api/admin/courses/create_course`, courseData,
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

const updateCourse = async (_id, courseData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/admin/courses/${_id}`, courseData,
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
    throw error.response;
  }
};

const getCourses = async (limit, page, sort) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/courses?limit=${limit}&page=${page}&sort=${sort}`,{
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

const getCourse = async (_id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/courses/${_id}`,{
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

const deleteCourse = async (_id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/courses/${_id}`,
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

const createCourseOrUpdatePlayListYoutube = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/courses/playLists`,
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



export { createCourse, getCourses, getCourse, updateCourse, deleteCourse, createCourseOrUpdatePlayListYoutube};
