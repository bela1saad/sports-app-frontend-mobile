import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../auth/AuthContext";
import { CommonActions } from "@react-navigation/native";

const Sidebar = () => {
  const navigation = useNavigation();
  const { logout } = useAuth(); // Get the logout function from useAuth
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Function to navigate to the Edit Profile screen
  const goToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  // Function to handle navigation to other sections
  const navigateToSection = (section) => {
    switch (section) {
      case "Friends":
        navigation.navigate("Friends");
        break;
      case "Wallet":
        navigation.navigate("Wallet");
        break;
      case "Bookings History":
        navigation.navigate("BookingsHistory");
        break;
      case "My Favorites":
        navigation.navigate("Favorites");
        break;
      case "About":
        navigation.navigate("About");
        break;
      default:
        console.log(`Navigating to ${section}`);
    }
  };

  const handleLogout = async () => {
    setShowConfirmation(true);
  };

  const confirmLogout = async () => {
    await logout();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
    setShowConfirmation(false); // Close the modal immediately after logout
  };

  const cancelLogout = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <LinearGradient colors={["#3333", "#1a1a1a"]} style={styles.container}>
      {/* Return Arrow */}
      <TouchableOpacity
        style={styles.returnArrow}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Increase touch area
      >
        <Icon name="arrow-left" size={24} color="#05a759" />
      </TouchableOpacity>

      {/* User Account Section */}
      <View style={styles.userAccountSection}>
        <Image
          source={require("../assets/user_photo.jpg")} // Use the user's profile photo
          style={styles.profilePhoto}
        />
        <Text style={styles.userName}>John Doe</Text>
        {/* Use the user's name */}
        <TouchableOpacity onPress={goToEditProfile}>
          <Text style={styles.editProfileButton}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Links */}
      <View style={styles.navigationSection}>
        <TouchableOpacity onPress={() => navigateToSection("Friends")}>
          <Text style={styles.navigationLink}>
            <Icon
              name="account-group"
              size={20}
              color="#05a759"
              style={styles.icon}
            />
            {"  "}
            Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToSection("Wallet")}>
          <Text style={styles.navigationLink}>
            <Icon name="wallet" size={20} color="#05a759" style={styles.icon} />
            {"  "}
            Wallet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToSection("Bookings History")}>
          <Text style={styles.navigationLink}>
            <Icon
              name="history"
              size={20}
              color="#05a759"
              style={styles.icon}
            />
            {"  "}
            Bookings History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToSection("My Favorites")}>
          <Text style={styles.navigationLink}>
            <Icon name="heart" size={20} color="#05a759" style={styles.icon} />
            {"  "}
            My Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToSection("About")}>
          <Text style={styles.navigationLink}>
            <Icon
              name="information"
              size={20}
              color="#05a759"
              style={styles.icon}
            />
            {"  "}
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.navigationLink}>
            <Icon name="logout" size={20} color="#05a759" style={styles.icon} />
            {"  "}
            Logout
          </Text>
        </TouchableOpacity>
        {/* Logout Confirmation Modal */}
        <Modal
          visible={showConfirmation}
          transparent
          animationType="fade"
          onRequestClose={() => setShowConfirmation(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to log out?
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmLogout}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={cancelLogout}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Copyright Section */}
      <View style={styles.copyrightSection}>
        <Text style={styles.copyRightText}>
          &copy; 2024 Your Company. All rights reserved.
        </Text>
      </View>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get("window");
const SPACING = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: SPACING,
    paddingTop: Platform.OS === "ios" ? height * 0.1 : SPACING,
    paddingBottom: SPACING,
  },
  returnArrow: {
    position: "absolute",
    top: Platform.OS === "ios" ? height * 0.05 : SPACING,
    left: SPACING,
    zIndex: 1,
  },
  userAccountSection: {
    marginBottom: SPACING * 2,
    alignItems: "center",
  },
  profilePhotoContainer: {
    marginBottom: SPACING,
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? -height * 0.05 : 0,
  },
  profilePhoto: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: (width * 0.25) / 2,
    borderWidth: 2,
    borderColor: COLORS.Green,
    transform: [{ scaleX: Platform.OS === "ios" ? -1 : 1 }],
  },
  userName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: SPACING,
    textAlign: "center",
  },
  editProfileButton: {
    color: "#05a759",
    fontSize: 16,
  },
  navigationSection: {
    flex: 1,
    marginTop: SPACING,
  },
  navigationLink: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: SPACING / 2,
    paddingHorizontal: SPACING,
    paddingVertical: SPACING / 1.5,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: SPACING / 2,
  },
  copyRightText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: COLORS.Green,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Sidebar;
