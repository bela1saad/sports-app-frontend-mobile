import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import COLORS from "../constants/colors"; // Make sure to have this file for color constants

const TeamCard = ({ team, onJoinPress }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: team.pic }} style={styles.teamImage} />
      <Text style={styles.teamName}>{team.name}</Text>
      <Text style={styles.teamDescription}>{team.description}</Text>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => onJoinPress(team.id)}
      >
        <Text style={styles.buttonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    padding: 15,
  },
  teamImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  teamDescription: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: COLORS.buttonColor,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default TeamCard;
