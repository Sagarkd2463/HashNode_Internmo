import React, { useEffect, useState } from "react";
import api from "../api/api.js";
import AuthContext from "./AuthContext.jsx";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Verify logged-in user
  useEffect(() => {
    let cancelled = false;

    const verifyUser = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        if (!cancelled) {
          setUser(response.data.data.user);
          setToken(savedToken);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Authentication failed:",
            error.response?.data?.message || error.message,
          );

          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    verifyUser();

    return () => {
      cancelled = true;
    };
  }, []);

  // Login
  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    const { user, token } = response.data.data;

    if (!token) {
      throw new Error("Authentication token not received.");
    }

    localStorage.setItem("token", token);

    setToken(token);
    setUser(user);

    return user;
  };

  // Register
  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);

    const { user, token } = response.data.data;

    if (!token) {
      throw new Error("Authentication token not received.");
    }

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
