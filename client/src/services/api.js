import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Pre-configured Axios Instance for API requests.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fintrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize API error responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors || [],
      originalError: error,
    };

    // Global 401 Unauthorized handling (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('fintrack_token');
      localStorage.removeItem('fintrack_user');
      // Could dispatch event or trigger redirect if authenticated routing requires it
    }

    return Promise.reject(customError);
  }
);

export default api;
