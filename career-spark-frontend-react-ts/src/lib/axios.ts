import axios from 'axios';
import { showLoading, hideLoading } from './loadingService';

// Normalize base URL
const rawBase = (import.meta.env.VITE_API_URL as string) || '';
const normalizedBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

const api = axios.create({
  baseURL: normalizedBase,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 🧩 Tự động bỏ Content-Type nếu là FormData
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// ==============================================
// 🔒 Token Refresh Logic + Global Loading
// ==============================================

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : token && resolve(token)
  );
  failedQueue = [];
};

// Request interceptor (add token + loading)
api.interceptors.request.use(
  (config) => {
    try {
      if (!config.headers['x-skip-loading']) {
        showLoading();
        (config as any).__showLoading = true;
      }
    } catch {}

    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if ((response.config as any).__showLoading) hideLoading();
    return response;
  },
  async (error) => {
    try {
      if (error.config && (error.config as any).__showLoading) hideLoading();
    } catch {
      console.error('Error in hideLoading', error);
    }

    const originalRequest = error.config;

    // 🧠 Nếu accessToken hết hạn (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đang refresh thì xếp request này vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.warn('No refresh token found → redirect to login');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        //  Import động tránh circular import
        const { authService } = await import(
          '@/features/auth/services/authService'
        );
        const response = await authService.refreshToken({ refreshToken });

        const newAccessToken =
          response.data?.accessToken || response.accessToken;
        if (response.success && newAccessToken) {
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return api(originalRequest); //  retry request cũ
        }

        throw new Error('Refresh failed');
      } catch (refreshError) {
        console.warn('Refresh token invalid → redirect login');
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
