//peticiones HTTP
import axios from 'axios';

// URL del backend; se puede cambiar con VITE_API_URL en frontend/.env
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
