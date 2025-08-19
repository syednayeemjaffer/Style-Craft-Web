import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp > currentTime) {
          setUser({
            email: payload.sub,
            role: payload.role,
            username: payload.username // Now properly included from token
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error('Token parsing error:', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://ecommerce-w3qm.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Login failed');
      }

      const token = await response.text();
      localStorage.setItem('token', token);
      setToken(token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        email: payload.sub,
        role: payload.role,
        username: payload.username // Now properly set from token
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch('https://ecommerce-w3qm.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Registration failed');
      }

      const token = await response.text();
      localStorage.setItem('token', token);
      setToken(token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        email: payload.sub,
        role: payload.role,
        username: payload.username // Now properly set from token
      });

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const value = {
    token,
    user,
    loading,
    login,
    register,
    logout,
    getAuthHeaders,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};