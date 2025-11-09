import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api', // Use proxy in development, configure at build time for production
  timeout: 10000,
  withCredentials: true, // Include cookies in requests
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(
    `Making ${config.method?.toUpperCase()} request to ${config.url}`
  );
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
