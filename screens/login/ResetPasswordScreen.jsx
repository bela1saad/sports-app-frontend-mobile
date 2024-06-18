// ResetPasswordScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import COLORS from "../../constants/colors";
import axiosInstance from "../../utils/axios";

const { width } = Dimensions.get("window");

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        email,
        newPassword,
      });
      console.log("Password reset successful:", response.data);
      Alert.alert(
        "Password Reset",
        "Your password has been successfully reset."
      );
      // Navigate to login screen or any other screen after password reset
      navigation.navigate("Login"); // Example navigation to login screen
    } catch (error) {
      console.error("Password reset error:", error);
      Alert.alert(
        "Error",
        error.response.data.message ||
          "An error occurred while resetting your password. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Your Password</Text>
      <Text style={styles.subtitle}>Enter your new password below.</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor={COLORS.black}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: width * 0.1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: width * 0.05,
    textAlign: "center",
    color: COLORS.black,
  },
  subtitle: {
    fontSize: width * 0.04,
    marginBottom: width * 0.05,
    textAlign: "center",
    color: COLORS.black,
  },
  input: {
    width: "100%",
    height: width * 0.12,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: width * 0.03,
    marginBottom: width * 0.05,
    paddingHorizontal: width * 0.04,
    fontSize: width * 0.04,
    color: COLORS.black,
  },
  button: {
    width: "100%",
    height: width * 0.12,
    backgroundColor: COLORS.primary,
    borderRadius: width * 0.03,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default ResetPasswordScreen;
