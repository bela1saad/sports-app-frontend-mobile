import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const NotificationsIcon = ({ count = 0, size = 24 }) => {
  const navigation = useNavigation();
  const [hasNotifications, setHasNotifications] = React.useState(false);

  const handlePress = () => {
    navigation.navigate("Notification");
    setHasNotifications(true);
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
        <Icon
          name="bell"
          size={size}
          color={hasNotifications ? "green" : "white"}
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
