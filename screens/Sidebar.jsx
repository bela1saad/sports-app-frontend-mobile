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
  ScrollView,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
  CommonActions,
} from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../auth/AuthContext";

const Sidebar = () => {
  const navigation = useNavigation();
  const { logout, currentPlayer } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const goToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const goToResetPassword = () => {
    navigation.navigate("ResetpPassword");
  };

  const navigateToSection = (section) => {
    navigation.navigate(section);
  };

  const handleLogout = () => {
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
    setShowConfirmation(false);
  };

  const cancelLogout = () => {
    setShowConfirmation(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, [navigation])
  );

  const { width, height } = Dimensions.get("window");
  const SPACING = height * 0.02;

  return (
    <LinearGradient colors={["#333333", "#1a1a1a"]} style={styles.container}>
      <TouchableOpacity
        style={styles.returnArrow}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Icon name="arrow-left" size={width * 0.06} color="#05a759" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {currentPlayer && (
          <View style={styles.userAccountSection}>
            <Image
              source={{ uri: currentPlayer.pic }}
              style={styles.profilePhoto}
            />
            <Text style={styles.userName}>{currentPlayer.name}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={goToEditProfile}
          >
            <Icon
              name="pencil"
              size={width * 0.04}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resetPasswordButton}
            onPress={goToResetPassword}
          >
            <Icon
              name="lock-reset"
              size={width * 0.04}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.resetPasswordButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.navigationSection}>
          <TouchableOpacity onPress={() => navigateToSection("Friends")}>
            <Text style={styles.navigationLink}>
              <Icon
                name="account-group"
                size={width * 0.05}
                color="#05a759"
                style={styles.icon}
              />
              {"  "}
              Friends
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToSection("Wallet")}>
            <Text style={styles.navigationLink}>
              <Icon
                name="wallet"
                size={width * 0.05}
                color="#05a759"
                style={styles.icon}
              />
              {"  "}
              Wallet
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToSection("Bookings")}>
            <Text style={styles.navigationLink}>
              <Icon
                name="calendar-check"
                size={width * 0.05}
                color="#05a759"
                style={styles.icon}
              />
              {"  "}
              Bookings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToSection("Transaction")}>
            <Text style={styles.navigationLink}>
              <Icon
                name="currency-usd"
                size={width * 0.05}
                color="#05a759"
                style={styles.icon}
              />
              {"  "}
              Transaction
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToSection("About")}>
            <Text style={styles.navigationLink}>
              <Icon
                name="information"
                size={width * 0.05}
                color="#05a759"
                style={styles.icon}
              />
              {"  "}
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.navigationLink}>
              <Icon
                name="logout"
                size={width * 0.05}
                color="#05a759"
                style={styles.icon}
              />
              {"  "}
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
            <TouchableOpacity style={styles.modalButton} onPress={cancelLogout}>
              <Text style={styles.modalButtonText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.copyRightText}>
          &copy; 2024 Your Company. All rights reserved.
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingTop:
      Platform.OS === "ios" ? Dimensions.get("window").height * 0.1 : 20,
  },
  returnArrow: {
    position: "absolute",
    top: Platform.OS === "ios" ? Dimensions.get("window").height * 0.05 : 20,
    left: 20,
    zIndex: 1,
  },
  userAccountSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  profilePhoto: {
    width: Dimensions.get("window").width * 0.99,
    height: Dimensions.get("window").width * 0.75,
    borderRadius: Dimensions.get("window").width * 0.05,
    marginBottom: 20,
  },
  userName: {
    color: "#ffffff",
    fontSize: Dimensions.get("window").width * 0.06,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: "#05a759",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  editProfileButtonText: {
    color: "#fff",
    fontSize: Dimensions.get("window").width * 0.04,
    marginLeft: 5,
  },
  resetPasswordButton: {
    backgroundColor: "#05a759",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  resetPasswordButtonText: {
    color: "#fff",
    fontSize: Dimensions.get("window").width * 0.04,
    marginLeft: 5,
  },
  buttonIcon: {
    marginRight: 5,
  },
  navigationSection: {
    flex: 1,
    marginVertical: 20,
  },
  navigationLink: {
    color: "#ffffff",
    fontSize: Dimensions.get("window").width * 0.045,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: Dimensions.get("window").width * 0.02,
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
    fontSize: Dimensions.get("window").width * 0.05,
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
    fontSize: Dimensions.get("window").width * 0.04,
  },
  footer: {
    alignItems: "center",
    marginBottom: 10,
  },
  copyRightText: {
    color: "#999",
    fontSize: Dimensions.get("window").width * 0.03,
    textAlign: "center",
    height: 40,
  },
});

export default Sidebar;
