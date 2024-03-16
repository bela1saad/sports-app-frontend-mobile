import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TournamentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Tournaments Screen</Text>
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

export default TournamentsScreen;
