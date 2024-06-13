import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, PanResponder, Animated } from "react-native";

const DraggablePlayer = ({ player, width, pitchHeight, onDragEnd }) => {
  const [draggingPosition, setDraggingPosition] = useState({
    x: player.x * width,
    y: player.y * pitchHeight,
  });

  const pan = new Animated.ValueXY();
  const [dragging, setDragging] = useState(false);

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
      x = Math.max(0, Math.min(x, width - 40)); // Subtract player width
      y = Math.max(0, Math.min(y, pitchHeight - 40)); // Subtract player height

      // Update local state with the final dragging position
      setDraggingPosition({ x, y });

      // Calculate normalized coordinates relative to field size
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
    <View style={styles.playerContainer}>
      <Animated.View
        style={[
          styles.player,
          {
            opacity: dragging ? 0 : 1, // Hide player icon when dragging
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={{ uri: player.player.pic }} style={styles.playerImage} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    position: "absolute",
  },
  player: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  playerImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default DraggablePlayer;
