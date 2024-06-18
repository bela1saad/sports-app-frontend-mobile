import React from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const footballFieldImage = require("../assets/football_field.jpg");
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Constants for field dimensions
const fieldWidth = screenWidth - 40;
const fieldHeight = fieldWidth * 1.5;

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
              left: player.x * fieldWidth,
              top: player.y * fieldHeight,
            },
          ]}
        >
          <Image
            source={{ uri: player.player.pic }}
            style={styles.playerImage}
            resizeMode="cover"
          />
          {player.isCaptain && (
            <View style={styles.captainBadge}>
              <Text style={styles.captainText}>C</Text>
            </View>
          )}
          <Text style={styles.playerName}>{player.player.name}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    aspectRatio: 3 / 4,
  },
  captainBadge: {
    position: "absolute",
    top: -fieldWidth * 0.03,
    right: -fieldWidth * 0.03,
    backgroundColor: "#FFD700",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  captainText: {
    color: "#000",
    fontWeight: "bold",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  playerContainer: {
    position: "absolute",
    alignItems: "center",
  },
  playerImage: {
    width: fieldWidth * 0.12,
    height: fieldWidth * 0.12,
    borderRadius: (fieldWidth * 0.12) / 2,
    borderWidth: 1,
    borderColor: "#fff",
  },
  captainIconContainer: {
    position: "absolute",
    top: -fieldWidth * 0.03,
    right: -fieldWidth * 0.03,
    alignItems: "center",
  },
  playerName: {
    marginTop: fieldWidth * 0.02,
    textAlign: "center",
    fontSize: fieldWidth * 0.025,
    color: "#d3d3d3",
    fontWeight: "bold",
  },
});

export default LineupGrid;
