import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const VerificationScreen = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons
          name="arrow-back"
          size={Dimensions.get("window").width * 0.07}
          color="#05a759"
        />
      </TouchableOpacity>
      <Text style={styles.title}>Verification Required</Text>
      <Text style={styles.text}>
        Please check your email for a verification link.
      </Text>
      <TouchableOpacity onPress={handleLoginPress} style={styles.button}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101010",
    paddingHorizontal: "5%",
  },
  backButton: {
    position: "absolute",
    top: "8%",
    left: "7%",
  },
  title: {
    fontSize: Dimensions.get("window").width * 0.06,
    fontWeight: "bold",
    marginBottom: "5%",
    color: "#05a759",
  },
  text: {
    fontSize: Dimensions.get("window").width * 0.04,
    marginBottom: "5%",
    textAlign: "center",
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#05a759",
    paddingVertical: "3%",
    paddingHorizontal: "10%",
    borderRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: Dimensions.get("window").width * 0.04,
    fontWeight: "bold",
  },
});

export default VerificationScreen;
