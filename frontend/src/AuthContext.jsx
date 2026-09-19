import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';
import { setTokens, clearTokens, getAccess } from './auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAccess()) { setLoading(false); return; }
    api.get('me/')
      .then(res => setUser(res.data))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await api.post('token/', { username, password });
    setTokens(res.data.access, res.data.refresh);
    const me = await api.get('me/');
    setUser(me.data);
  };

  const register = async (data) => {
    await api.post('register/', data);
    await login(data.username, data.password);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);