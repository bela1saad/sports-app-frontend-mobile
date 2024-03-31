import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ProfileLink = ({ profileType, profileId, onPress }) => {
  const handlePress = () => {
    onPress(profileType, profileId);
  };

  let linkText;
  switch (profileType) {
    case "player":
      linkText = "View Player Profile";
      break;
    case "team":
      linkText = "View Team Profile";
      break;
    case "club":
      linkText = "View Club Profile";
      break;
    case "tournament":
      linkText = "View Tournament Profile";
      break;
    default:
      linkText = "View Profile";
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.link}>
      <Text style={styles.text}>{linkText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    backgroundColor: "#05a759",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileLink;
