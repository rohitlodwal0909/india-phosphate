import axios from 'axios';
import { apiUrl } from 'src/constants/contant';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Request interceptor → har request me token add
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
