import axios from 'axios';
import { getGuestId } from './session';

const setupAxios = () => {
  // Set the base configuration
  axios.defaults.baseURL = 'http://localhost:8000';

  // Request interceptor: Attach token if it exists
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add Guest ID for social features
      config.headers['X-Guest-ID'] = getGuestId();

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle expired tokens
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 Unauthorized
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        // Don't retry if the original request WAS the refresh token request itself
        if (originalRequest.url.includes('/api/token/refresh/')) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          try {
            // Use a fresh axios instance or a direct call that doesn't trigger the interceptor again
            // with the same header logic if possible, or just be careful.
            const res = await axios.post('/api/token/refresh/', { refresh: refreshToken });
            const newAccessToken = res.data.access;
            localStorage.setItem('access_token', newAccessToken);
            
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            localStorage.clear();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        } else {
            localStorage.clear();
            window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxios;
