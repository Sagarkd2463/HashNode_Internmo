import React, { useEffect, useState } from "react";
import api from "../api/api.js";
import AuthContext from "./AuthContext.jsx";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Check whether the user is already authenticated
  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  // Login
  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    const { user, token } = response.data.data;

    localStorage.setItem("token", token);

    setToken(token);
    setUser(user);

    return user;
  };

  // Register
  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);

    const { user, token } = response.data.data;

    localStorage.setItem("token", token);

    setToken(token);
    setUser(user);

    return user;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    setUser,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;