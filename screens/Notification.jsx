import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

// Import dummy notifications data
import { notifications } from "../Data/dummyData";

// Notification Component for Friend Request
const FriendRequestNotification = ({
  notification,
  onPressProfile,
  onAccept,
  onReject,
}) => {
  const { senderName, senderPhoto } = notification;
  return (
    <View style={styles.notificationContainer}>
      <TouchableOpacity onPress={onPressProfile}>
        <Image source={senderPhoto} style={styles.senderPhoto} />
      </TouchableOpacity>
      <View style={styles.notificationContent}>
        <TouchableOpacity onPress={onPressProfile}>
          <Text style={styles.senderName}>{senderName}</Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={onAccept}
            style={[styles.button, styles.acceptButton]}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onReject}
            style={[styles.button, styles.rejectButton]}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Notification = () => {
  // Event handlers
  const handlePressProfile = () => {
    // Handle press on sender's profile
  };

  const handleAccept = () => {
    // Handle accept action
  };

  const handleReject = () => {
    // Handle reject action
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      {notifications.map((notification) => {
        switch (notification.type) {
          case "friend_request":
            return (
              <FriendRequestNotification
                key={notification.id}
                notification={notification}
                onPressProfile={handlePressProfile}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            );
          // Add cases for other notification types
          default:
            return null;
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  notificationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  senderPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: "green",
  },
  rejectButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Notification;
