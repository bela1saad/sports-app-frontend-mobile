import React from "react";
import { View, Image, StyleSheet } from "react-native";

const PhotoFullScreen = ({ route }) => {
  const { photoUrl } = route.params;

  return (
    <View style={styles.container}>
      <Image source={photoUrl} resizeMode="contain" style={styles.photo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
});

export default PhotoFullScreen;
