import React from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const footballFieldImage = require("../assets/football_field.jpg");
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const LineupGrid = ({ lineup }) => {
  return (
    <View style={styles.container}>
      <Image source={footballFieldImage} style={styles.backgroundImage} />
      {lineup.map((player) => (
        <View
          key={player.id}
          style={[
            styles.playerContainer,
            {
              left: player.x * screenWidth,
              top: player.y * screenHeight,
            },
          ]}
        >
          <Image source={player.photo} style={styles.playerImage} />
          {player.isCaptain && (
            <View style={styles.captainIconContainer}>
              <Ionicons
                name="star"
                size={screenWidth * 0.05} // Adjust size dynamically
                color="gold"
              />
            </View>
          )}
          <Text style={styles.playerName}>{player.name}</Text>
          <View style={styles.positionContainer}>
            <Text style={styles.position}>{player.position}</Text>
          </View>
          <View style={styles.jerseyContainer}>
            <Text style={styles.jerseyNumber}>{player.jerseyNumber}</Text>
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
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    width: screenWidth * 0.99, // Use screenWidth as the width
    height: screenHeight * 0.6, // Use screenHeight as the height
    marginHorizontal: -20,
  },

  playerContainer: {
    position: "absolute",
    alignItems: "center",
  },
  playerImage: {
    width: screenWidth * 0.12, // Adjust size dynamically
    height: screenWidth * 0.12, // Adjust size dynamically
    borderRadius: (screenWidth * 0.1) / 2, // Adjust size dynamically
  },
  captainIconContainer: {
    position: "absolute",
    top: -screenWidth * 0.03, // Adjust position dynamically
    left: 0, // Adjust position dynamically
    right: screenWidth * 0.07, // Center horizontally
    alignItems: "center", // Center vertically
  },
  playerName: {
    bottom: screenWidth * 0.0001, // Adjust position dynamically
    top: screenWidth * 0.02, // Adjust position dynamically
    textAlign: "center",
    fontSize: screenWidth * 0.025, // Adjust size dynamically
    color: "#d3d3d3",
    fontWeight: "bold",
  },
  positionContainer: {
    position: "absolute",
    right: screenWidth * 0.099, // Adjust position dynamically
    bottom: screenWidth * 0.02, // Adjust position dynamically
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: screenWidth * 0.01, // Adjust size dynamically
    paddingVertical: screenWidth * 0.005, // Adjust size dynamically
    borderRadius: screenWidth * 0.02, // Adjust size dynamically
    marginLeft: screenWidth * 0.02,
  },
  jerseyContainer: {
    position: "absolute",
    left: screenWidth * 0.099,
    bottom: screenWidth * 0.02, // Adjust position dynamically
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: screenWidth * 0.01, // Adjust size dynamically
    paddingVertical: screenWidth * 0.003, // Adjust size dynamically
    borderRadius: screenWidth * 0.02, // Adjust size dynamically
  },
  position: {
    fontSize: screenWidth * 0.02, // Adjust size dynamically
    color: "white",
    fontWeight: "bold",
  },
  jerseyNumber: {
    fontSize: screenWidth * 0.02, // Adjust size dynamically
    color: "white",
    fontWeight: "bold",
  },
});

export default LineupGrid;
