import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TeamScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Team Screen</Text>
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

export default TeamScreen;
