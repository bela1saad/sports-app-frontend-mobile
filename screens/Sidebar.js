import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Sidebar = () => {
  return (
    <View style={styles.container}>
      <Text>Sidebar Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Sidebar;
