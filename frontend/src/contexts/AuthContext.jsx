// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
// Make sure you have a config file for your API base URL
// For example: export const AUTH_API_BASE = 'http://localhost:5000';
import { AUTH_API_BASE } from '../services/api';

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      const payload = decodeJwtPayload(storedToken);
      if (payload?.email) setUser({ name: payload.name, email: payload.email });
    }
    setLoading(false);
  }, []);

  const saveAuth = (jwt) => {
    localStorage.setItem('auth_token', jwt);
    setToken(jwt);
    const payload = decodeJwtPayload(jwt);
    setUser(payload ? { name: payload.name, email: payload.email } : null);
  };

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  // ==========================================================
  // ==      THIS IS THE CODE THAT WAS MISSING             ==
  // ==========================================================
  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(`${AUTH_API_BASE}/login`, { email, password });
      if (res.data?.token) {
        saveAuth(res.data.token);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw error to be caught by the component
    }
  };

  const signup = async ({ name, email, password }) => {
    try {
      const res = await axios.post(`${AUTH_API_BASE}/signup`, { name, email, password });
      if (res.data?.token) {
        saveAuth(res.data.token);
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error; // Re-throw error to be caught by the component
    }
  };

  const authHeader = useCallback(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const updateUser = async (updatedData) => {
    try {
      const res = await axios.put(
        `${AUTH_API_BASE}/profile`,
        updatedData, 
        { headers: authHeader() }
      );
      
      if (res.data?.token) {
        saveAuth(res.data.token);
      }
      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  };

  const logout = () => clearAuth();

  const value = useMemo(
    () => ({
      isAuthenticated: !!token,
      loading,
      user,
      token,
      login,
      signup,
      updateUser,
      logout,
      authHeader,
    }),
    [token, loading, user, authHeader]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}