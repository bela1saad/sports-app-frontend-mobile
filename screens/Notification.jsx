import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  SafeAreaView,
  Dimensions,
} from "react-native";
import axiosInstance from "../utils/axios"; // Import your configured Axios instance
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import SendNotificationButton from "../components/SendNotificationButton";

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Hide header on this screen
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/request/received");
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const handleAccept = async (requestId, type) => {
    try {
      let endpoint = "";
      let requestBody = { requestId, response: "accepted" };

      switch (type) {
        case "joinTeam":
          endpoint = "/request/team/respond";
          break;
        case "inviteToTeam":
          endpoint = "/request/team/invite/respond";
          break;
        case "needPlayer":
        case "needEnemyTeam":
          endpoint = `/request/post/respond/${requestId}`;
          requestBody = { response: "accepted" };
          break;
        default:
          console.log("Unknown notification type:", type);
          return;
      }

      const response = await axiosInstance.put(endpoint, requestBody);
      console.log("Request accepted:", response.data);
      fetchNotifications(); // Refresh notifications after response
    } catch (error) {
      console.error("Error accepting request:", error.response.data.message); // Log backend error message
      // Handle error
    }
  };

  const handleReject = async (requestId, type) => {
    try {
      let endpoint = "";
      let requestBody = { requestId, response: "declined" };

      switch (type) {
        case "joinTeam":
          endpoint = "/request/team/respond";
          break;
        case "inviteToTeam":
          endpoint = "/request/team/invite/respond";
          break;
        case "needPlayer":
        case "needEnemyTeam":
          endpoint = `/request/post/respond/${requestId}`;
          requestBody = { response: "declined" };
          break;
        default:
          console.log("Unknown notification type:", type);
          return;
      }

      const response = await axiosInstance.put(endpoint, requestBody);
      console.log("Request declined:", response.data);
      fetchNotifications(); // Refresh notifications after response
    } catch (error) {
      console.error("Error rejecting request:", error.response.data.message); // Log backend error message
      if (error.response.data.message === "Player is already in a team") {
        // Handle this specific error scenario
        // For example, show an alert to the user
        alert(
          "You cannot decline the request because you are already in a team."
        );
      } else {
        // Handle other errors or generic error message
        alert("Error rejecting request. Please try again later.");
      }
      // Optionally, you can update UI or handle other logic based on the error
    }
  };

  const renderItem = ({ item }) => {
    const { id, type, status, createdAt, team } = item;

    let notificationText = "";
    let iconComponent = null;

    switch (type) {
      case "joinTeam":
        notificationText = "Join Team Request";
        iconComponent = <Icon name="users" size={24} color="#05a759" />;
        break;
      case "inviteToTeam":
        notificationText = "Team Invite";
        iconComponent = <Icon name="user-plus" size={24} color="#05a759" />;
        break;
      case "needPlayer":
        notificationText = "Need Player";
        iconComponent = <Icon name="user" size={24} color="#05a759" />;
        break;
      case "needEnemyTeam":
        notificationText = "Need Enemy Team";
        iconComponent = <Icon name="users" size={24} color="#05a759" />;
        break;
      default:
        console.log("Unknown notification type:", type);
        notificationText = "Unknown";
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>
            {team && team.pic ? (
              <Image source={{ uri: team.pic }} style={styles.teamPhoto} />
            ) : (
              <View style={styles.iconPlaceholder}>{iconComponent}</View>
            )}
          </View>
          <View style={styles.middleSection}>
            <Text style={styles.notificationType}>{notificationText}</Text>
            {team && (
              <View style={styles.teamDetails}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamDescription}>{team.description}</Text>
                <Text style={styles.teamLevel}>Level: {team.level}</Text>
                <Text style={styles.teamStatus}>Status: {status}</Text>
              </View>
            )}
            <Text style={styles.notificationDate}>
              Date: {new Date(createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <TouchableOpacity
              onPress={() => handleAccept(id, type)}
              style={[styles.button, styles.acceptButton]}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleReject(id, type)}
              style={[styles.button, styles.rejectButton]}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color="#05a759"
          style={{ marginVertical: 20 }}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <View>
          <SendNotificationButton />
        </View>

        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#101010",
  },
  container: {
    flex: 1,
    backgroundColor: "#101010",
    alignItems: "center", // Center content horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
    color: "#05a759",
  },
  card: {
    backgroundColor: "#333333",
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    width: Dimensions.get("window").width - 40, // Adjust card width based on screen width
    alignSelf: "center", // Center the card horizontally
  },
  cardContent: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  leftSection: {
    marginRight: 15,
  },
  middleSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#666666",
    borderRadius: 25,
  },
  teamPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  notificationType: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#05a759",
  },
  teamDetails: {
    marginTop: 5,
  },
  teamName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#05a759",
  },
  teamDescription: {
    color: "#ccc",
    fontSize: 12,
  },
  teamLevel: {
    fontStyle: "italic",
    color: "#ccc",
    fontSize: 12,
  },
  teamStatus: {
    marginTop: 3,
    color: "#ccc",
    fontSize: 12,
  },
  notificationDate: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptButton: {
    backgroundColor: "#05a759",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1, // Ensure content fills the container vertically
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#666666",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  teamPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  notificationType: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#05a759",
  },
  teamDetails: {
    marginTop: 5,
  },
  teamName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#05a759",
  },
  teamDescription: {
    color: "#ccc",
    fontSize: 12,
  },
  teamLevel: {
    fontStyle: "italic",
    color: "#ccc",
    fontSize: 12,
  },
  teamStatus: {
    marginTop: 3,
    color: "#ccc",
    fontSize: 12,
  },
  notificationDate: {
    fontSize: 12,
    color: "#ccc",
    marginTop: 5,
  },
});

export default NotificationScreen;
