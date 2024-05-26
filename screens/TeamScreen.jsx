import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../utils/axios";
import COLORS from "../constants/colors"; // Ensure you have this file for color constants
import { useLayoutEffect } from "react";

const TeamScreen = ({ route }) => {
  const navigation = useNavigation();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    const checkTeamStatus = async () => {
      try {
        const response = await axiosInstance.get("/team/");
        if (response.status === 200 && response.data.team) {
          setTeam(response.data.team);
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

    checkTeamStatus();
  }, [route.params]);

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
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamDescription}>{team.description}</Text>
        {/* Additional logic for team info */}
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
});

export default TeamScreen;
