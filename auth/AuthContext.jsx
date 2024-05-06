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

  // Function to load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      console.log("Retrieved token from AsyncStorage2:", storedToken);
      if (storedToken) {
        // If token is found, set it in state
        setToken(storedToken);
        // Optionally, load other user data here if needed
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    // Load user data when component mounts
    loadUserData();
  }, []);

  // Function to handle user login
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { token, id, role_id } = response.data;
      await AsyncStorage.setItem("token", token); // Set token in AsyncStorage
      setToken(token); // Update token in the state
      setUserId(id); // Update user ID in the state
      setRoleId(role_id); // Update role ID in the state

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

  // Function to handle user registration
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
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

  // Function to handle password reset
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

  // Function to handle user logout
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
