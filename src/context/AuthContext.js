import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async (token) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('http://localhost:5000/api/auth/profile');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (email, password) => {
    try {
      setError(null);
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      return true;
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};