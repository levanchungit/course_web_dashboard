import axios from 'axios';
import { getToken } from '@/configs/authConfig';
import { BASE_URL } from '@/constants/basic';

const ROUTE_GET_ME = "/api/admin/users/me";
const ROUTE_UPDATE_ME = "/api/admin/users/me";

const getMe = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${ROUTE_GET_ME}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Logout Error:', error);
    throw error.response;
  }
};

const updateMe = async (data) => {
  try {
    const response = await axios.put(`${BASE_URL}${ROUTE_UPDATE_ME}`,data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Logout Error:', error);
    throw error.response;
  }
}


export { getMe, updateMe };
