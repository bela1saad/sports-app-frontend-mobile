import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  Text,
  Dimensions,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const DraggablePlayer = ({ player, width, pitchHeight, onDragEnd }) => {
  const [dragging, setDragging] = useState(false);
  const [draggingPosition, setDraggingPosition] = useState({
    x: player.isBenched ? 0 : player.x * width,
    y: player.isBenched ? 0 : player.y * pitchHeight,
  });

  const pan = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => {
      setDragging(true);
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (evt, gesture) => {
      let x = draggingPosition.x + gesture.dx;
      let y = draggingPosition.y + gesture.dy;

      // Clamp position within field boundaries but allow dragging to the bench area
      x = Math.max(0, Math.min(x, width - 60));
      y = Math.max(0, Math.min(y, pitchHeight + 100)); // Allow extra space for bench

      setDraggingPosition({ x, y });

      const isOnBench = y > pitchHeight - 20; // Adjust threshold for bench

      if (isOnBench) {
        x = 0;
        y = pitchHeight + 20; // Position in bench area
      } else {
        x = Math.max(0, Math.min(x, width - 60));
        y = Math.max(0, Math.min(y, pitchHeight - 80));
      }

      const normalizedX = x / width;
      const normalizedY = y / pitchHeight;

      onDragEnd(player, x, y, normalizedX, normalizedY);

      setDragging(false);
      pan.setValue({ x: 0, y: 0 });
    },
  });

  useEffect(() => {
    pan.setValue({ x: draggingPosition.x, y: draggingPosition.y });
  }, [draggingPosition]);

  return (
    <Animated.View
      style={[
        styles.player,
        {
          opacity: dragging ? 0 : 1,
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: player.player.pic }} style={styles.playerImage} />
        {player.isCaptain && (
          <View style={styles.captainBadge}>
            <Text style={styles.captainText}>C</Text>
          </View>
        )}
      </View>
      <Text style={styles.playerName}>{player.player.name}</Text>
    </Animated.View>
  );
};

const fieldWidth = screenWidth - 40;
const styles = StyleSheet.create({
  player: {
    alignItems: "center",
    position: "absolute",
    width: 60,
    height: 80,
  },
  imageContainer: {
    position: "relative",
  },
  playerImage: {
    width: fieldWidth * 0.12, // Adjusted to match LineupGrid's player image size
    height: fieldWidth * 0.12, // Adjusted to match LineupGrid's player image size
    borderRadius: (fieldWidth * 0.12) / 2,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 5,
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
  playerName: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});

export default DraggablePlayer;
