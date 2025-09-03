import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string, // URL gốc backend
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - Redirect to login');
      // Có thể redirect hoặc refresh token
    }
    return Promise.reject(error);
  }
);

export default api;
