import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import FieldsScreen from "./screens/FieldsScreen";
import TeamScreen from "./screens/TeamScreen";
import TournamentsScreen from "./screens/TournamentsScreen";
import Welcome from "./screens/Welcome";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
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

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Fields" component={FieldsScreen} />
        <Stack.Screen name="Team" component={TeamScreen} />
        <Stack.Screen name="Tournaments" component={TournamentsScreen} />
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
        <Stack.Screen
          name="BookingsHistory"
          component={BookingsHistoryScreen}
        />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
