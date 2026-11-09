import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Check existing authentication when app loads
  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        const currentUser = response.data.data.user;

        setUser(currentUser);
        setToken(savedToken);
      } catch (error) {
        console.error(
          "Authentication verification failed:",
          error.response?.data || error.message,
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // Login user
  const login = async (form) => {
    const response = await api.post("/auth/login", form);

    const result = response.data;

    if (!result.success || !result.data?.token || !result.data?.user) {
      throw new Error(result.message || "Login failed");
    }

    const { token: authToken, user: userData } = result.data;

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);

    return userData;
  };

  // Register user
  const register = async (form) => {
    const response = await api.post("/auth/register", form);

    const result = response.data;

    if (!result.success || !result.data?.token || !result.data?.user) {
      throw new Error(result.message || "Registration failed");
    }

    const { token: authToken, user: userData } = result.data;

    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);

    return userData;
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(user && token);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};