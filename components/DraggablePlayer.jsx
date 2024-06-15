import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  Text,
} from "react-native";

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

      // Clamp position within field boundaries
      x = Math.max(0, Math.min(x, width - 60)); // Subtract player width
      y = Math.max(0, Math.min(y, pitchHeight - 80)); // Subtract player height

      // Update local state with the final dragging position
      setDraggingPosition({ x, y });

      // Determine if dropped on bench or field
      const isOnBench = y > pitchHeight - 100; // Assuming bench starts at pitchHeight - 100

      // Update player position and normalized coordinates
      if (isOnBench) {
        x = 0;
        y = 0;
      } else {
        x = Math.max(0, Math.min(x, width - 60)); // Subtract player width
        y = Math.max(0, Math.min(y, pitchHeight - 80)); // Subtract player height
      }

      const normalizedX = x / width;
      const normalizedY = y / pitchHeight;

      // Call onDragEnd prop from parent component with updated player position
      onDragEnd(player, x, y, normalizedX, normalizedY);

      // Reset dragging state and Animated.Value for next drag
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
          opacity: dragging ? 0.5 : 1, // Reduce opacity when dragging
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
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
    marginBottom: 5,
  },
  captainBadge: {
    position: "absolute",
    top: -5,
    right: -5,
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
