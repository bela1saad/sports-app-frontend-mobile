import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../utils/axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roleId, setRoleId] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [error, setError] = useState(null);

  // Function to load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      console.log("Retrieved token from AsyncStorage:", storedToken);
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (token) {
      getCurrentPlayer();
    }
  }, [token]);

  const getCurrentPlayer = async () => {
    try {
      const response = await axiosInstance.get("/player");
      setCurrentPlayer(response.data);

      // Log a message indicating that the current player has been fetched
      console.log("Current player fetched successfully.");
    } catch (error) {
      // Extract error message from the response if available
      const errorMessage = error.response
        ? error.response.data.message
        : "An error occurred while fetching the current player. Please try again later.";

      // Log the error message without triggering Expo or console error reporting
      console.log("Error fetching current player:", errorMessage);

      // Display error message in a pop-out
      alert(
        `${errorMessage}. To edit your player, please go to the EditPlayer screen.`
      );
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const { token, id, role_id } = response.data;
      await AsyncStorage.setItem("token", token);
      setToken(token);
      setUserId(id);
      setRoleId(role_id);
      getCurrentPlayer(); // Fetch current player after login
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
      const response = await axiosInstance.post("/auth/register", userData);
      const responseData = response.data;
      if (responseData.message && responseData.token) {
        return true;
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("An error occurred. Please try again later.");
      }
    }
  };

  const resetPassword = async (username, email, newPassword, phone_number) => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        username,
        email,
        newPassword,
        phone_number,
      });
      console.log("Password reset successful:", response.data.message);
      return true;
    } catch (error) {
      console.error("Password reset failed:", error);
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        email,
        newPassword: "123456789", // Assuming default new password
      });
      console.log(
        "Password reset email sent successfully:",
        response.data.message
      );
      return response.data; // Return the response for handling in the component
    } catch (error) {
      console.error("Forgot password error:", error);
      throw error; // Throw error to handle in the component
    }
  };

  const logout = async () => {
    setToken(null);
    setUserId(null);
    setRoleId(null);
    setCurrentPlayer(null);
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        currentPlayer,
        login,
        register,
        resetPassword,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
