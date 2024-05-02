import React from "react";
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

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Fields" component={FieldsScreen} />
        <Stack.Screen name="Team" component={TeamScreen} />
        <Stack.Screen name="Tournaments" component={TournamentsScreen} />
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
    </NavigationContainer>
  );
};

const MainTabs = () => {
  const { token } = useAuth();
  return token ? <BottomTabNavigator /> : <Welcome />;
};

const WrappedApp = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default WrappedApp;
