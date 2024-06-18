// EnterEmailScreen.js

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
import axiosInstance from "../../utils/axios"; // Import your axios instance
import COLORS from "../../constants/colors";

const { width } = Dimensions.get("window");

const EnterEmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleNext = async () => {
    if (email.trim() === "") {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/auth/reset-password/send-code",
        {
          email,
        }
      );
      console.log("Send code response:", response.data);
      navigation.navigate("EnterCode", { email });
    } catch (error) {
      console.error("Send code error:", error);
      Alert.alert(
        "Send Code Error",
        error.response.data.message ||
          "An error occurred while sending the verification code. Please try again later."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Your Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email address below to receive instructions on how to reset
        your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor={COLORS.black}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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

export default EnterEmailScreen;
