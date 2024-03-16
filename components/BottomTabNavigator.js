import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
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
            iconName = "th-large";
          } else if (route.name === "Team") {
            iconName = "users";
          } else if (route.name === "Tournaments") {
            iconName = "trophy";
          }

          return <FontAwesome5 name={iconName} size={24} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#05a759",
        inactiveTintColor: "#000000",
        style: {
          backgroundColor: "#000000", // Set background color of tab bar to black
        },
        showLabel: false, // Hide labels
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Fields" component={FieldsScreen} />
      <Tab.Screen name="Team" component={TeamScreen} />
      <Tab.Screen name="Tournaments" component={TournamentsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
