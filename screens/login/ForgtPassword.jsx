import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
} from "react-native";
import COLORS from "../../constants/colors";
import { useAuth } from "../../auth/AuthContext"; // Import useAuth hook

const { width } = Dimensions.get("window");

const ForgotPassword = ({ navigation }) => {
  const { forgotPassword } = useAuth(); // Access the forgotPassword function from useAuth
  const [email, setEmail] = useState("");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const handleForgotPassword = async () => {
    try {
      const response = await forgotPassword(email); // Call the forgotPassword function with the email
      Alert.alert("Password Reset", response.data.message);
    } catch (error) {
      console.error("Forgot password error:", error);
      Alert.alert(
        "Password Reset Error",
        error.response.data.message ||
          "An error occurred. Please try again later."
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
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
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

export default ForgotPassword;
