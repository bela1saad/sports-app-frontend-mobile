import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../utils/axios";
import COLORS from "../constants/colors"; // Ensure you have this file for color constants

const TeamScreen = ({ route }) => {
  const navigation = useNavigation();
  const [team, setTeam] = useState(null);
  const [sport, setSport] = useState(null);
  const [error, setError] = useState(null);
  const [isCaptain, setIsCaptain] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/team/");
        if (response.status === 200 && response.data.team) {
          setTeam(response.data.team);
          fetchSport(response.data.team.sport_id); // Fetch sport data by ID
          checkIsCaptain();
        } else if (response.status === 404) {
          setTeam(false);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.message === "Player is not in a team"
        ) {
          setTeam(false);
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    };

    const fetchSport = async (sportId) => {
      try {
        const response = await axiosInstance.get(`/sport/by-id/${sportId}`);
        if (response.status === 200 && response.data) {
          setSport(response.data);
        }
      } catch (error) {
        console.error("Error fetching sport data:", error);
      }
    };

    const checkIsCaptain = async () => {
      try {
        const response = await axiosInstance.get("/player/isTeamCaptain");
        if (response.status === 200 && response.data.isCaptain) {
          setIsCaptain(true);
          console.log("User is a captain of the team");
        } else {
          setIsCaptain(false);
          console.log("User is not a captain of the team");
        }
      } catch (error) {
        console.error("Error checking captain status:", error);
      }
    };

    fetchData();
  }, [route.params]);

  const handleEditTeam = () => {
    // Navigate to the edit team screen
    navigation.navigate("EditTeamScreen");
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (team === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTeamText}>You don't have a team yet.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CreateTeamScreen")}
        >
          <Text style={styles.buttonText}>Create a Team</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>or</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("JoinTeamScreen")}
        >
          <Text style={styles.buttonText}>Join a Team</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: team.pic }}
          style={styles.teamImage}
          resizeMode="cover"
        />
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamDescription}>{team.description}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Max Players:</Text>
            <Text style={styles.infoText}>{team.max_number}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Level:</Text>
            <Text style={styles.infoText}>{team.level}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Up for a Game:</Text>
            <Text style={styles.infoText}>
              {team.up_for_game ? "Yes" : "No"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Captain ID:</Text>
            <Text style={styles.infoText}>{team.captain_id}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sport:</Text>
            <Text style={styles.infoText}>
              {sport ? sport.name : "Loading..."}
            </Text>
          </View>
        </View>
        {isCaptain && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.secondary }]}
            onPress={handleEditTeam}
          >
            <Text style={styles.buttonText}>Edit Team</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101010",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 20,
  },
  teamImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  teamName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  teamDescription: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
    textAlign: "center",
  },
  noTeamText: {
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.Green,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  orText: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 10,
    textAlign: "center",
  },
  infoContainer: {
    marginTop: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default TeamScreen;
