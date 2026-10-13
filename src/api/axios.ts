//peticiones HTTP
import axios from 'axios';
// Api para el backend
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
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
