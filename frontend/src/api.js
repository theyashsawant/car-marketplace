import axios from 'axios';
import { getAccess, getRefresh, setTokens, clearTokens } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

// Attach the token to every outgoing request
api.interceptors.request.use(config => {
  const token = getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If a request fails with 401, try refreshing the token once
api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retried && getRefresh()) {
      original._retried = true;
      try {
        const res = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: getRefresh(),
        });
        setTokens(res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;