import React from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";

const footballFieldImage = require("../assets/football_field.jpg");
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const LineupGrid = ({ lineup }) => {
  return (
    <View style={styles.container}>
      <Image source={footballFieldImage} style={styles.backgroundImage} />
      {lineup.map((player, index) => (
        <View
          key={index}
          style={[
            styles.playerContainer,
            {
              left: (player.x / screenWidth) * 100 + "%",
              top: (player.y / screenHeight) * 100 + "%",
            },
          ]}
        >
          <Image source={player.photo} style={styles.playerImage} />
          <View style={styles.textContainer}>
            <Text style={styles.playerName}>{player.name}</Text>
            <Text style={styles.playerPosition}>{player.position}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    aspectRatio: 1.16,
  },
  backgroundImage: {
    position: "absolute",
    width: "111%", // Adjust as needed
    height: "130%", // Adjust as needed
  },
  playerContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  playerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  playerName: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  playerPosition: {
    fontSize: 12,
    color: "white",
  },
});

export default LineupGrid;
