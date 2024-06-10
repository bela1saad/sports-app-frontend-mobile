import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../constants/colors";

const PlayerCard = ({ player, onInvitePress }) => {
  const handleInvite = () => {
    onInvitePress(player.id);
  };

  // Define availability container style dynamically based on player's availability
  const availabilityContainerStyle = {
    backgroundColor: player.available ? "green" : "red",
  };

  // Map sport names to corresponding icons (assuming you have icons imported)
  const sportIcons = {
    Football: "soccer",
    Basketball: "basketball",
    Tennis: "tennis",
    // Add more sports and their icons as needed
  };

  return (
    <TouchableOpacity style={styles.card}>
      <View
        style={[
          styles.availableContainer,
          { backgroundColor: player.available ? COLORS.success : COLORS.error },
        ]}
      >
        <View style={[styles.availableContainer, availabilityContainerStyle]}>
          <Text style={styles.availableText}>
            {player.available ? "Available" : "Unavailable"}
          </Text>
        </View>
      </View>
      <Image source={{ uri: player.pic }} style={styles.playerImage} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{player.name}</Text>
        <View style={styles.infoContainer}>
          <Icon
            name="map-marker"
            size={16}
            color={COLORS.Green}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{player.location}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon
            name={sportIcons[player.sport.name]}
            size={16}
            color={COLORS.Green}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{player.sport.name}</Text>
        </View>
        <Text style={styles.position}>{player.position.key}</Text>
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={handleInvite}
          activeOpacity={0.8} // Reduce the opacity on press
        >
          <Icon name="account-plus" size={20} color={COLORS.white} />
          <Text style={styles.inviteButtonText}>Invite</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#2B2B2B",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    padding: 15,
    alignItems: "center",
    position: "relative",
  },
  availableContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availableText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 5,
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.white,
  },
  position: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 5,
  },
  inviteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 25, // Increased border radius
    paddingHorizontal: 20, // Increased padding
    paddingVertical: 10, // Increased padding
    marginTop: 10,
    elevation: 3, // Add elevation for better visibility
  },
  inviteButtonText: {
    color: COLORS.white,
    marginLeft: 5,
  },
});

export default PlayerCard;
