import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import Checkbox from "expo-checkbox";
import Button from "../../components/Button";
import { useAuth } from "../../auth/AuthContext"; // Import useAuth hook

const { width, height } = Dimensions.get("window");

const Signup = ({ navigation }) => {
  const { register } = useAuth(); // Access the register function from useAuth

  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    countryCode: "+963",
    phone_number: "",
    password: "",
    roleId: "1",
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const handleChange = (name, value) => {
    if (name === "phone_number") {
      const phone_number = formData.countryCode + value;
      setFormData({ ...formData, [name]: phone_number });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = async () => {
    try {
      const phone_number = formData.countryCode + formData.phone_number;
      const updatedFormData = { ...formData, phone_number };
      console.log("Form Data:", updatedFormData); // Log the updatedFormData
      const registrationSuccessful = await register(updatedFormData); // Call register function with updatedFormData
      if (registrationSuccessful) {
        navigation.navigate("Verification"); // Navigate to the verification screen
      }
    } catch (error) {
      Alert.alert(
        "Registration Error",
        error.message || "An error occurred. Please try again later."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Connect with your friends today!
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>User Name</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder="Enter your User Name"
                placeholderTextColor={COLORS.black}
                keyboardType="default"
                style={styles.textInput}
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder="Enter your email address"
                placeholderTextColor={COLORS.black}
                keyboardType="email-address"
                style={styles.textInput}
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.mobileInputContainer}>
              <TextInput
                placeholder="+963"
                placeholderTextColor={COLORS.black}
                keyboardType="numeric"
                style={styles.countryCodeInput}
                value={formData.countryCode}
                onChangeText={(text) =>
                  setFormData({ ...formData, countryCode: text })
                }
              />
              <TextInput
                placeholder=" Enter your phone number"
                placeholderTextColor={COLORS.black}
                keyboardType="numeric"
                style={styles.phone_numberInput}
                value={formData.phone_number}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone_number: text })
                }
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={COLORS.black}
                secureTextEntry={!isPasswordShown}
                style={styles.textInput}
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordShown(!isPasswordShown)}
              >
                <Ionicons
                  name={isPasswordShown ? "eye-off" : "eye"}
                  size={24}
                  marginRight={10}
                  color={COLORS.black}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.checkboxContainer}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? COLORS.primary : undefined}
            />
            <Text style={styles.checkboxLabel}>
              I agree to the terms and conditions
            </Text>
          </View>

          <Button
            title="Sign Up"
            onPress={handleSignup}
            filled
            style={styles.button}
          />

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text
                style={[
                  styles.footerText,
                  { color: COLORS.primary, fontWeight: "bold", marginLeft: 6 },
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const isArabicKeyboard = Platform.OS === "android" ? true : false;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    marginHorizontal: 22,
    marginTop: 22,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  titleContainer: {
    marginBottom: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.black,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 8,
  },
  textInputContainer: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 22,
  },
  mobileInputContainer: {
    flexDirection: "row",
    width: "100%",
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    paddingLeft: 22,
  },
  countryCodeInput: {
    width: "16%",
    height: "100%",
    color: COLORS.black,
    borderRightWidth: 1,
  },
  phone_numberInput: {
    flex: 1,
    height: "100%",
    color: COLORS.black,
    left: 8,
  },
  textInput: {
    flex: 1,
    height: "100%",
    color: COLORS.black,
    paddingRight: isArabicKeyboard ? 15 : 15, // Add padding for Arabic text input
  },
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 6,
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS.black,
  },
  button: {
    marginTop: 18,
    marginBottom: 4,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  footerText: {
    fontSize: 16,
    color: COLORS.black,
  },
});

export default Signup;
