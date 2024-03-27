import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

const FriendRequestNotification = ({
  notification,
  onPressProfile,
  onAccept,
  onReject,
}) => {
  const { senderName, senderPhoto, receivedTime } = notification;

  // Function to format received time
  const formatReceivedTime = (time) => {
    const now = new Date();
    const diffMs = now - time;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      if (diffDays === 1) return "1 day ago";
      else return `${diffDays} days ago`;
    } else {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours > 0) {
        if (diffHours === 1) return "1 hour ago";
        else return `${diffHours} hours ago`;
      } else {
        return "Just now";
      }
    }
  };

  return (
    <View style={styles.notificationContainer}>
      <TouchableOpacity onPress={onPressProfile}>
        <Image source={senderPhoto} style={styles.senderPhoto} />
      </TouchableOpacity>
      <View style={styles.notificationContent}>
        <TouchableOpacity onPress={onPressProfile}>
          <Text style={styles.senderName}>{senderName}</Text>
        </TouchableOpacity>
        <Text style={styles.receivedTime}>
          {formatReceivedTime(receivedTime)}
        </Text>
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

const styles = StyleSheet.create({
  // Styles for the Friend Request Notification component
});

export default FriendRequestNotification;
