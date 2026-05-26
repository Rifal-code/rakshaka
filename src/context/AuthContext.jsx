import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rakshaka_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data if token exists on mount
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Token is invalid, clear it
          logout();
        }
      } catch (err) {
        console.error("Failed to authenticate session:", err);
        // Clear token if token is expired or server returned error
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(email, password);
      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('rakshaka_token', newToken);
        setToken(newToken);
        setUser(userData);
        return response;
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Failed to login");
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.register(username, email, password);
      setIsLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to register");
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('rakshaka_token');
    setToken(null);
    setUser(null);
    setIsLoading(false);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    role: user?.role || 'user',
    isAdmin: user?.role === 'admin',
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
