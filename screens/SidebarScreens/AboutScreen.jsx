import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const AboutScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="keyboard-backspace" size={24} color="#05a759" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.backButton}></View>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>
          Welcome to our company!{"\n\n"}
          We are committed to providing high-quality products and services to
          our customers. Our mission is to provide exceptional value and
          satisfaction to every customer we serve.{"\n\n"}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac
          urna ut nisi maximus faucibus. In hac habitasse platea dictumst.
        </Text>
        {/* Add more information as needed */}
      </View>
      <View style={styles.contactSection}>
        <Text style={styles.contactText}>Contact Us:</Text>
        <View style={styles.socialMediaIcons}>
          <TouchableOpacity onPress={() => console.log("Facebook")}>
            <Icon
              name="facebook"
              size={24}
              color="#05a759"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Instagram")}>
            <Icon
              name="instagram"
              size={24}
              color="#05a759"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "#05a759",
    fontSize: 24,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
  content: {
    flex: 1,
  },
  text: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
  },
  contactSection: {
    marginBottom: 80,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  contactText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  socialMediaIcons: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 10,
  },
});

export default AboutScreen;
