import axios from 'axios';
import { setTokens, removeTokens } from '@/configs/authConfig';
import { BASE_URL } from '@/constants/basic';

const ROUTE_LOGIN = "/api/auth/login";
const ROUTE_CHECK_TOKEN = "/api/auth/check_token";

const login = async (email, passwordHash, device_id) => {
  try {
    const response = await axios.post(`${BASE_URL}${ROUTE_LOGIN}`, {
      email,
      passwordHash,
      device_id,
    });

    const { accessToken, refreshToken } = response.data;

    setTokens(accessToken, refreshToken);

    return response.data;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

const logout = async () => {
  try {
    removeTokens();
    return null;
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};

const checkAccessTokenValidity = async (access_token) => {
  try {
    const response = await axios.post(`${BASE_URL}${ROUTE_CHECK_TOKEN}`, {
      access_token,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export { login, logout, checkAccessTokenValidity };
