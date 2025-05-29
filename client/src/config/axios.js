import axios from 'axios';
import { API_BASE_URL } from './api-config';

// Ensure all API requests include credentials for cookies
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;
