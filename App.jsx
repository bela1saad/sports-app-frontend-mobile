import React, { useState, useEffect } from "react";
import { AuthProvider } from "./auth/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "./auth/AuthContext";
import HomeScreen from "./screens/HomeScreen";
import FieldsScreen from "./screens/FieldsScreen";
import TeamScreen from "./screens/TeamScreen";
import TournamentsScreen from "./screens/TournamentsScreen";
import Welcome from "./screens/login/Welcome";
import Signup from "./screens/login/Signup";
import Login from "./screens/login/Login";
import VerificationScreen from "./screens/login/Verification";
import ForgotPassword from "./screens/login/ForgtPassword";
import BottomTabNavigator from "./components/BottomTabNavigator";
import Sidebar from "./screens/Sidebar";
import Notification from "./screens/Notification";
import SearchScreen from "./screens/SearchScreen";
import AboutScreen from "./screens/SidebarScreens/AboutScreen";
import BookingsHistoryScreen from "./screens/SidebarScreens/BookingsHistoryScreen";
import EditProfileScreen from "./screens/SidebarScreens/EditProfileScreen";
import FavoritesScreen from "./screens/SidebarScreens/FavoritesScreen";
import FriendsScreen from "./screens/SidebarScreens/FriendsScreen";
import WalletScreen from "./screens/SidebarScreens/WalletScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PhotoFullScreen from "./screens/PhotoFullScreen";
import FollowersFollowingScreen from "./screens/FollowersFollowingScreen";
import LoadingIndicator from "./components/LoadingIndicator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProtectedRoute from "./auth/ProtectedRoute";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          {/* Public Screens (no protection needed) */}
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

          {/* Protected Screens (wrap with ProtectedRoute) */}
          <Stack.Screen
            name="MainTabs"
            component={BottomTabNavigator} // Pass the BottomTabNavigator component directly
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Fields"
            component={FieldsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Team"
            component={TeamScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tournaments"
            component={TournamentsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Sidebar" component={Sidebar} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen
            name="BookingsHistory"
            component={BookingsHistoryScreen}
          />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="PhotoFullScreen" component={PhotoFullScreen} />
          <Stack.Screen
            name="FollowersFollowing"
            component={FollowersFollowingScreen}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

const MainTabs = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Fetch the token from wherever it's stored
        // For example, using AsyncStorage
        const storedToken = await AsyncStorage.getItem("token");

        // Update the loading state based on whether the token is available
        setLoading(false);
      } catch (error) {
        console.error("Error fetching token:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    // Call the fetchToken function
    fetchToken();
  }, []);

  // Render loading indicator while waiting for the token to be fetched
  if (loading) {
    return <LoadingIndicator />;
  }

  // Render BottomTabNavigator if authenticated, otherwise render Welcome screen
  return token ? <BottomTabNavigator /> : <Welcome />;
};

export default App;
