import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";

const SendNotificationButton = () => {
  useEffect(() => {
    const getNotificationPermission = async () => {
      try {
        const settings = await Notifications.requestPermissionsAsync();
        if (!settings.granted) {
          throw new Error("Permission not granted for notifications");
        }
      } catch (error) {
        console.error("Failed to get notification permission:", error);
      }
    };

    getNotificationPermission();
  }, []);

  const sendNotification = async () => {
    try {
      const notificationContent = {
        title: "New Message",
        body: "You have a new message from John Doe",
      };

      const identifier = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null, // This triggers the notification immediately
      });

      console.log("Scheduled notification:", identifier);
    } catch (error) {
      console.error("Failed to schedule notification:", error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={sendNotification}>
      <Text style={styles.buttonText}>Send Notification</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SendNotificationButton;
