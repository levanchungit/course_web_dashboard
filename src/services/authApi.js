// authApi.js

import axios from 'axios';
import { setTokens, removeTokens } from '@/configs/authConfig';

const BASE_URL = 'http://192.168.1.220:3000';

const ROUTE_LOGIN = "/api/auth/login";
const ROUTE_CHECK_TOKEN = "/api/auth/check_token"; // Change this to the actual route on your server

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
    // You may want to send a request to the server to invalidate the current session
    // or perform any other necessary cleanup operations.

    // For now, simply remove tokens from localStorage
    removeTokens();

    // Assuming the server does not return any data on logout
    return null;
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};

const checkAccessTokenValidity = async (access_token) => {
  try {
    // Make a request to your server to validate the access token
    const response = await axios.post(`${BASE_URL}${ROUTE_CHECK_TOKEN}`, {
      access_token,
    });
    return response;
  } catch (error) {
    // If the response is not okay or an error occurs, reject the promise
    throw error;
  }
};

export { login, logout, checkAccessTokenValidity };
