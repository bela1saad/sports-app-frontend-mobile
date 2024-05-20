import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../utils/axios";

const TeamScreen = ({ route }) => {
  const navigation = useNavigation();
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);

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
          setTeam(false);
        }
      }
    };

    checkTeamStatus();
  }, [route.params]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (team === null) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.container}>
        <Text>You don't have a team yet.</Text>
        <Button
          title="Create a Team"
          onPress={() => navigation.navigate("CreateTeamScreen")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Team Screen</Text>
      <Text>Team Name: {team.name}</Text>
      <Text>Description: {team.description}</Text>
      {/* Additional logic for team info */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TeamScreen;
