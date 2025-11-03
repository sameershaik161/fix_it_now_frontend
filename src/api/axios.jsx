import axios from 'axios';

// Use Vite environment variable if available, else fall back to your deployed backend
const API_URL = import.meta.env.VITE_API_URL || 'https://fix-it-now-backend-3v2n.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
