import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const NotificationsIcon = ({ count, size }) => {
  const [hasNotifications, setHasNotifications] = useState(false);

  const handlePress = () => {
    // Handle notification icon press here (e.g., navigate to notifications screen)
    console.log("Notification icon pressed");
    // Simulate a new notification
    setHasNotifications(true);
    // Simulate resetting notification after 3 seconds
    setTimeout(() => setHasNotifications(false), 3000);
  };

  const renderNotificationCount = () => {
    if (count > 99) {
      return "+99";
    } else if (count > 0) {
      return count.toString();
    } else {
      return null;
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={{ position: "relative" }}>
        <FontAwesomeIcon
          icon={faBell}
          size={size}
          style={{ color: hasNotifications ? "green" : "white" }}
        />
        {hasNotifications && (
          <View
            style={{
              position: "absolute",
              top: -3,
              right: -3,
              width: 8,
              height: 8,
              backgroundColor: "green",
              borderRadius: 4,
            }}
          />
        )}
        {count > 0 && (
          <View
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              backgroundColor: "#05a759",
              borderRadius: 10,
              paddingHorizontal: 5,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: "white", fontSize: 7 }}>
              {renderNotificationCount()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationsIcon;
