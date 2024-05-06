import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Dimensions,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import COLORS from "../../constants/colors";
import Button from "../../components/Button";
import { useAuth } from "../../auth/AuthContext"; // Import useAuth hook
import { CommonActions } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const { login } = useAuth(); // Access the login function from useAuth

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const handleLogin = async () => {
    try {
      const success = await login(email, password);
      if (success) {
        // Reset the navigation stack and navigate to the Home screen upon successful login
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          })
        );
      } else {
        // Handle login failure (optional)
        console.log("Login failed");
      }
    } catch (error) {
      Alert.alert(
        "Login Error",
        error.message || "An error occurred. Please try again later."
      );
    }
  };

  const handleForgotPassword = () => {
    // Navigate to the forgot password screen
    navigation.navigate("ForgotPassword");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, marginHorizontal: width * 0.05 }}>
        <View style={{ marginVertical: width * 0.05 }}>
          <Text
            style={{
              fontSize: width * 0.06,
              fontWeight: "bold",
              marginVertical: width * 0.04,
              color: COLORS.black,
            }}
          >
            Hi Welcome Back ! 👋
          </Text>

          <Text
            style={{
              fontSize: width * 0.04,
              color: COLORS.black,
            }}
          >
            Hello again you have been missed!
          </Text>
        </View>

        <View style={{ marginBottom: width * 0.03 }}>
          <Text
            style={{
              fontSize: width * 0.04,
              fontWeight: "400",
              marginVertical: width * 0.02,
            }}
          >
            Email address
          </Text>

          <View
            style={{
              width: "100%",
              height: width * 0.12,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: width * 0.03,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: width * 0.06,
            }}
          >
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.black}
              value={email}
              onChangeText={(text) => setEmail(text)}
              keyboardType="email-address"
              style={{
                width: "100%",
              }}
            />
          </View>
        </View>

        <View style={{ marginBottom: width * 0.03 }}>
          <Text
            style={{
              fontSize: width * 0.04,
              fontWeight: "400",
              marginVertical: width * 0.02,
            }}
          >
            Password
          </Text>

          <View
            style={{
              width: "100%",
              height: width * 0.12,
              borderColor: COLORS.black,
              borderWidth: 1,
              borderRadius: width * 0.03,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: width * 0.06,
            }}
          >
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor={COLORS.black}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={isPasswordShown}
              style={{
                width: "100%",
              }}
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: width * 0.04,
              }}
            >
              {isPasswordShown ? (
                <Ionicons
                  name="eye-off"
                  size={width * 0.07}
                  color={COLORS.black}
                />
              ) : (
                <Ionicons name="eye" size={width * 0.07} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginVertical: width * 0.015,
          }}
        >
          <Checkbox
            style={{ marginRight: width * 0.02 }}
            value={isChecked}
            onValueChange={setIsChecked}
            color={isChecked ? COLORS.primary : undefined}
          />

          <Text>Remember Me</Text>
        </View>

        <Button
          title="Login"
          onPress={handleLogin}
          filled
          style={{
            marginTop: width * 0.036,
            marginBottom: width * 0.018,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: width * 0.05,
          }}
        >
          <Text
            style={{
              fontSize: width * 0.04,
              color: COLORS.black,
              marginRight: width * 0.02,
            }}
          >
            Forgot your password?
          </Text>
          <Pressable onPress={handleForgotPassword}>
            <Text
              style={{
                fontSize: width * 0.04,
                color: COLORS.primary,
                fontWeight: "bold",
              }}
            >
              Reset Password
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: width * 0.04,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: width * 0.02,
            }}
          />
          <Text style={{ fontSize: width * 0.035 }}></Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: COLORS.grey,
              marginHorizontal: width * 0.02,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: width * 0.05,
          }}
        >
          <Text style={{ fontSize: width * 0.04, color: COLORS.black }}>
            Don't have an account ?{" "}
          </Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text
              style={{
                fontSize: width * 0.04,
                color: COLORS.primary,
                fontWeight: "bold",
                marginLeft: width * 0.02,
              }}
            >
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
