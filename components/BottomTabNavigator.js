import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import FieldsScreen from "../screens/FieldsScreen";
import TeamScreen from "../screens/TeamScreen";
import TournamentsScreen from "../screens/TournamentsScreen";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Fields") {
            iconName = "soccer-field";
          } else if (route.name === "Team") {
            iconName = "account-group-outline";
          } else if (route.name === "Tournaments") {
            iconName = "trophy";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={24} color={color} />
          );
        },
        tabBarActiveTintColor: "#05a759",
        tabBarInactiveTintColor: "#BDBDBD",
        tabBarLabelStyle: {
          display: "none",
        },
        tabBarStyle: {
          display: "flex",
          height: Platform.OS === "ios" ? 80 : 50, // Adjusted height for Android
          paddingTop: Platform.OS === "ios" ? 20 : 0,
          borderTopWidth: Platform.OS === "ios" ? 2 : 2,
          borderTopColor: "#05a759",
          backgroundColor: "#000000",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Fields" component={FieldsScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="Tournaments" component={TournamentsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
