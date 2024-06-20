import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Button,
  SafeAreaView,
} from "react-native";
import axiosInstance from "../utils/axios"; // Import axios

const ResetPasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleChangePassword = async () => {
    // Data to send in the request
    const data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      const response = await axiosInstance.post("/user/change-password", data);

      // Check if request was successful
      if (response.status === 200) {
        // Password changed successfully
        Alert.alert("Success", "Password changed successfully!");
        // Navigate back to previous screen or any desired screen
        navigation.goBack();
      } else {
        // Error occurred, set error state with the message from backend
        setError(response.message || "An error occurred.");
      }
    } catch (error) {
      // Network error or other unexpected error
      console.error("Error:", error);

      if (error.response && error.response.status === 401) {
        setError("Old Password is wrong ");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Reset Your Password</Text>
          </View>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              placeholderTextColor={"#424242"}
              secureTextEntry
              value={oldPassword}
              onChangeText={(text) => setOldPassword(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={"#424242"}
              secureTextEntry
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={styles.button}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#05a759",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#05a759",
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#05a759",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default ResetPasswordScreen;
