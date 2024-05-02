import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        console.log("Retrieved token from AsyncStorage:", storedToken);
        if (storedToken) {
          console.log("Setting token in state:", storedToken);
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
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { token, id, role_id } = response.data;
      await AsyncStorage.setItem("token", token); // Set token in AsyncStorage first
      setToken(token); // Then set token in the state
      setUserId(id);
      setRoleId(role_id);
      console.log("Token set in AsyncStorage:", token);

      return true;
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else {
        console.error("Login failed:", error);
        throw new Error("An error occurred. Please try again later.");
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/auth/register", userData);
      const responseData = response.data;
      if (responseData.message && responseData.token) {
        // If the response contains a message and token, move to VerificationScreen
        return true; // Indicate successful registration
      } else {
        // If the response does not contain the expected fields, handle it as an error
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      // Handle errors as before
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("An error occurred. Please try again later.");
      }
    }
  };

  const resetPassword = async (username, email, newPassword, phone_number) => {
    try {
      const response = await axios.post("/auth/reset-password", {
        username,
        email,
        newPassword,
        phone_number,
      });
      console.log("Password reset successful:", response.data.message);
      return true; // Password reset successful
    } catch (error) {
      console.error("Password reset failed:", error);
      return false; // Password reset failed
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
      value={{ token, userId, roleId, login, register, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
