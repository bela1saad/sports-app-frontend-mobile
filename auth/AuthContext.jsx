import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "./axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };
    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token, id, role_id } = response.data;
      setToken(token);
      setUserId(id);
      setRoleId(role_id);
      await AsyncStorage.setItem("token", token);
      return true; // Login successful
    } catch (error) {
      console.error("Login failed:", error);
      return false; // Login failed
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/auth/register", userData);
      const { token, id, role_id } = response.data;
      setToken(token);
      setUserId(id);
      setRoleId(role_id);
      await AsyncStorage.setItem("token", token);
      return true; // Registration successful
    } catch (error) {
      console.error("Registration failed:", error);
      return false; // Registration failed
    }
  };

  const logout = async () => {
    setToken(null);
    setUserId(null);
    setRoleId(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ token, userId, roleId, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
