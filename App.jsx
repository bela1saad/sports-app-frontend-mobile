import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { AuthProvider } from "./auth/AuthContext";
import * as Notifications from "expo-notifications";

const App = () => {
  useEffect(() => {
    // Request permission to receive notifications (iOS only)
    Notifications.requestPermissionsAsync().then((status) => {
      console.log("Permission status:", status);
    });

    // Handle notifications when the app is running in the foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received:", notification);
    });

    // Handle notifications when the app is opened from a background state
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Notification response received:", response);
    });

    // Clean up listeners when component unmounts
    return () => {
      Notifications.removeNotificationSubscription();
      Notifications.removeNotificationSubscription();
    };
  }, []);

  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
