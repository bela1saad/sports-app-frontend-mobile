import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../constants/colors"; // Ensure this file contains your color constants

const TeamCard = ({ team, onJoinPress }) => {
  const navigation = useNavigation();

  const handleTeamPress = () => {
    // Navigate to the team's profile screen
    navigation.navigate("TeamProfile", { teamId: team.id });
  };

  // Function to get the appropriate sport icon based on the sport_id
  const getSportIcon = (sportId) => {
    switch (sportId) {
      case 1:
        return "soccer";
      case 2:
        return "basketball";
      case 3:
        return "tennis";
      default:
        return "account-group"; // Default icon if sport_id is not found
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleTeamPress}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: team.pic }} style={styles.teamImage} />
          {team.up_for_game && (
            <View style={styles.onlineDot}>
              <Icon name="check-circle" size={24} color={COLORS.Green} />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={handleTeamPress}>
          <View style={styles.teamNameContainer}>
            <Text style={styles.teamName}>{team.name}</Text>
            {/* Display the appropriate sport icon after the team name */}
            <Icon
              name={getSportIcon(team.sport_id)}
              size={20}
              color={COLORS.primary}
              style={styles.sportIcon}
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.teamDescription}>{team.description}</Text>
        <View style={styles.additionalInfo}>
          <View style={styles.infoItem}>
            <Icon name="account-group" size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>Max Players: {team.max_number}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => onJoinPress(team.id)}
        >
          <Text style={styles.buttonText}>Request to Join</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  imageContainer: {
    position: "relative",
  },
  teamImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    marginBottom: 100,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: COLORS.success,
    width: 30,
    height: 210,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  teamNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  teamDescription: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 10,
  },
  additionalInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.white,
    marginLeft: 5,
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  sportIcon: {
    marginLeft: 10,
  },
});

export default TeamCard;
