import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (user) setInitialLoading(false);
      // Trong app thật: gọi API /me để xác thực token rồi setUser
    } else {
      setInitialLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        const { token, ...user } = response.data;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      } else {
        // Throw error với message từ server
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Throw lại error để component có thể catch
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await authService.register({name, email, password});
      if (response.success) {
        const { token, ...user } = response.data;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = { user, loading, login, register, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};
