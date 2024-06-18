// EnterCodeScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import COLORS from "../../constants/colors";
import axiosInstance from "../../utils/axios";

const { width } = Dimensions.get("window");

const EnterCodeScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [code, setCode] = useState("");

  const handleVerifyCode = async () => {
    try {
      const response = await axiosInstance.post(
        "/auth/reset-password/verify-code",
        {
          email,
          code,
        }
      );
      console.log("Verification successful:", response.data);
      navigation.navigate("ResetPassword", { email });
    } catch (error) {
      console.error("Verification code error:", error);
      alert(
        error.response.data.message ||
          "An error occurred while verifying the code. Please check the code and try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Text style={styles.subtitle}>
        Please enter the verification code sent to your email.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        placeholderTextColor={COLORS.black}
        value={code}
        onChangeText={setCode}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
        <Text style={styles.buttonText}>Verify Code</Text>
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

export default EnterCodeScreen;
