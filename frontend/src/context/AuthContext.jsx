import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('stoken');
    if (!token) { setLoading(false); return; }
    authAPI.me()
      .then(r => setUser(r.data.user))
      .catch(() => localStorage.removeItem('stoken'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const r = await authAPI.login({ email, password });
    localStorage.setItem('stoken', r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };

  const register = async (username, email, password) => {
    const r = await authAPI.register({ username, email, password });
    localStorage.setItem('stoken', r.data.token);
    setUser(r.data.user);
    return r.data.user;
  };

  const logout = () => { localStorage.removeItem('stoken'); setUser(null); };
  const updateUser = u => setUser(p => ({ ...p, ...u }));

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
