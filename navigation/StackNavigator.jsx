import React, { useState, useEffect, useContext } from "react";
import { AuthProvider } from "../auth/AuthContext";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import FieldsScreen from "../screens/FieldsScreen";
import TeamScreen from "../screens/TeamScreen";
import TournamentsScreen from "../screens/TournamentsScreen";
import Welcome from "../screens/login/Welcome";
import Signup from "../screens/login/Signup";
import Login from "../screens/login/Login";
import VerificationScreen from "../screens/login/Verification";
import ForgotPassword from "../screens/login/ForgtPassword";
import BottomTabNavigator from "./BottomTabNavigator";
import Sidebar from "../screens/Sidebar";
import Notification from "../screens/Notification";
import SearchScreen from "../screens/SearchScreen";
import AboutScreen from "../screens/SidebarScreens/AboutScreen";
import BookingsHistoryScreen from "../screens/SidebarScreens/BookingsHistoryScreen";
import EditProfileScreen from "../screens/SidebarScreens/EditProfileScreen";
import FavoritesScreen from "../screens/SidebarScreens/FavoritesScreen";
import FriendsScreen from "../screens/SidebarScreens/FriendsScreen";
import WalletScreen from "../screens/SidebarScreens/WalletScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PhotoFullScreen from "../screens/PhotoFullScreen";
import FollowersFollowingScreen from "../screens/FollowersFollowingScreen";
import AuthContext from "../auth/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingIndicator from "../components/LoadingIndicator";

const Stack = createStackNavigator();

const StackNavigator = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setLoading(false); // Set loading to false after token check
        }
      } catch (error) {
        console.error("Error loading token from AsyncStorage:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    checkToken();
  }, []);

  return (
    <Stack.Navigator>
      {/* Public Screens */}
      {token ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Sidebar" component={Sidebar} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="Wallet" component={WalletScreen} />
          <Stack.Screen name="About" component={AboutScreen} />

          <Stack.Screen
            name="BookingsHistory"
            component={BookingsHistoryScreen}
          />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="PhotoFullScreen" component={PhotoFullScreen} />
          <Stack.Screen
            name="FollowersFollowing"
            component={FollowersFollowingScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
