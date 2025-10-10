// src/lib/axios.ts
import axios from 'axios';
import { showLoading, hideLoading } from './loadingService';

// Normalize base URL from env (ensure no trailing slash)
const rawBase = (import.meta.env.VITE_API_URL as string) || '';
const normalizedBase = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;

const api = axios.create({
  baseURL: normalizedBase, // URL gốc backend (no trailing slash)
  timeout: 30000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 🧩 Interceptor tự động bỏ JSON header khi gửi FormData
api.interceptors.request.use((config) => {
  // Nếu payload là FormData (upload file, ảnh, v.v.)
  if (config.data instanceof FormData) {
    // Xóa Content-Type để browser tự gán multipart/form-data; boundary=...
    delete config.headers['Content-Type'];
  }
  return config;
});

// ======================================================
// 🔒 Token refresh logic & global loading handler
// ======================================================

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Show global loader for requests unless caller set x-skip-loading header
    try {
      if (!config?.headers || !config.headers['x-skip-loading']) {
        showLoading();
        // mark so response interceptor knows to hide
        (config as any).__showLoading = true;
      }
    } catch (e) {
      // ignore
    }

    // Attach access token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with automatic token refresh
api.interceptors.response.use(
  (response) => {
    try {
      if ((response.config as any).__showLoading) hideLoading();
    } catch (e) {
      // ignore
    }
    return response;
  },
  async (error) => {
    try {
      if (error?.config && (error.config as any).__showLoading) hideLoading();
    } catch (e) {
      // ignore
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Use authService for token refresh
          const { authService } = await import(
            '../features/auth/services/authService'
          );
          const response = await authService.refreshToken({ refreshToken });

          if (response.success && response.accessToken) {
            const newToken = response.accessToken;

            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            processQueue(null, newToken);
            return api(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          console.warn('Token refresh failed - Redirecting to login');
          processQueue(refreshError, null);

          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        console.warn('No refresh token available - Redirecting to login');
        processQueue(new Error('No refresh token'), null);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        window.location.href = '/login';

        isRefreshing = false;
        return Promise.reject(error);
      }
    }

    // For other errors, just pass them through
    return Promise.reject(error);
  }
);

export default api;
