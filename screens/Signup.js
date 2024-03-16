import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";

const Signup = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Connect with your friends today!</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email address</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={styles.textInput}
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
            />
            <TextInput
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.black}
              keyboardType="numeric"
              style={styles.phoneNumberInput}
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
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
            >
              <Ionicons
                name={isPasswordShown ? "eye-off" : "eye"}
                size={24}
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
          onPress={() => navigation.navigate("MainTabs")}
          filled
          style={styles.button}
        />

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
    </SafeAreaView>
  );
};

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
    width: "20%",
    height: "100%",
    color: COLORS.black,
    borderRightWidth: 1,
  },
  phoneNumberInput: {
    flex: 1,
    height: "100%",
    color: COLORS.black,
  },
  textInput: {
    flex: 1,
    height: "100%",
    color: COLORS.black,
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
