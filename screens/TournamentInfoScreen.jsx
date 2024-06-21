import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import axiosInstance from "../utils/axios";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../auth/AuthContext";

const TournamentInfoScreen = () => {
  const route = useRoute();
  const { tournamentId } = route.params;
  const navigation = useNavigation();
  const { currentPlayer } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [participatedTournaments, setParticipatedTournaments] = useState([]);
  const [teamNames, setTeamNames] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchTournamentInfo();
    fetchParticipatedTournaments(); // Fetch tournaments the player is participating in
    fetchTeamNames(); // Fetch team names for the tournament
  }, []);

  // Use useFocusEffect to refresh data on screen focus
  useFocusEffect(
    React.useCallback(() => {
      fetchTournamentInfo();
      fetchParticipatedTournaments();
      fetchTeamNames();
    }, [])
  );

  const fetchTournamentInfo = async () => {
    try {
      const response = await axiosInstance.get(
        `/tournament/belal-request/${tournamentId}`
      );
      setTournament(response.data);
    } catch (error) {
      console.error("Error fetching tournament info:", error);
    }
  };

  const fetchParticipatedTournaments = async () => {
    try {
      const response = await axiosInstance.get(`/tournament/participated`);
      setParticipatedTournaments(response.data);
    } catch (error) {
      console.error("Error fetching participated tournaments:", error);
    }
  };

  const fetchTeamNames = async () => {
    try {
      const response = await axiosInstance.get(
        `/tournament/belal-request/${tournamentId}`
      );
      setTeamNames(response.data.teams);
    } catch (error) {
      console.error("Error fetching team names:", error);
    }
  };

  const handleJoin = async () => {
    try {
      await axiosInstance.post(`/tournament/join/${tournamentId}`);
      fetchTournamentInfo(); // Refresh the tournament info after joining
      fetchParticipatedTournaments(); // Refresh the participated tournaments
      Alert.alert("Success", "You have successfully joined the tournament.");
    } catch (error) {
      console.error("Error joining tournament:", error);
      if (error.response) {
        const errorMessage = error.response.data.message;
        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert("Error", "Failed to join tournament.");
      }
    }
  };

  const handleLeave = () => {
    Alert.alert(
      "Confirm Leave",
      "Are you sure you want to leave this tournament?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Leave", onPress: confirmLeave },
      ]
    );
  };

  const confirmLeave = async () => {
    try {
      await axiosInstance.post(`/tournament/forfeit/${tournamentId}`);
      fetchTournamentInfo(); // Refresh the tournament info after leaving
      fetchParticipatedTournaments(); // Refresh the participated tournaments
      Alert.alert("Success", "You have successfully left the tournament.");
    } catch (error) {
      console.error("Error leaving tournament:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to leave the tournament."
      );
    }
  };

  const renderMatchCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Round {item.round}</Text>
        <Icon name="calendar" size={24} color="#05a759" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardText}>
          {item.firstTeam} vs {item.secondTeam}
        </Text>
      </View>
      <View style={styles.cardInfo}>
        <Icon name="calendar" size={18} color="#05a759" />
        <Text style={styles.cardText}>{`Date: ${item.date || "TBD"}`}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Icon name="information" size={18} color="#05a759" />
        <Text style={styles.cardText}>{`Status: ${item.status}`}</Text>
      </View>
      {item.status === "completed" && (
        <View style={styles.cardInfo}>
          <Icon name="trophy" size={18} color="#05a759" />
          <Text style={styles.cardText}>{`Winner: ${item.winnerTeam}`}</Text>
        </View>
      )}
    </View>
  );

  if (!tournament) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Check if the tournamentId is in the participatedTournaments array
  const isUserInTournament = participatedTournaments.some(
    (t) => t.id === tournamentId
  );

  // Group matches by rounds
  const groupedMatches = {};
  tournament.matches.forEach((match) => {
    if (!groupedMatches[match.round]) {
      groupedMatches[match.round] = [];
    }
    groupedMatches[match.round].push(match);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tournamentInfo}>
        <View style={styles.header}>
          <Text style={styles.title}>{tournament.name}</Text>
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{tournament.status}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color="#05a759" />
            <Text style={styles.detailText}>
              Start Date: {tournament.start_date}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={20} color="#05a759" />
            <Text style={styles.detailText}>
              End Date: {tournament.end_date}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="account-group" size={20} color="#05a759" />
            <Text style={styles.detailText}>
              Max Teams: {tournament.max_teams}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="cash" size={20} color="#05a759" />
            <Text style={styles.detailText}>
              Entry Fees: {tournament.entry_fees}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          {tournament.status === "pending" ? (
            isUserInTournament ? (
              <TouchableOpacity
                style={[styles.button, styles.leaveButton]}
                onPress={handleLeave}
              >
                <Text style={styles.buttonText}>Forfeit Tournament</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, styles.joinButton]}
                onPress={handleJoin}
              >
                <Text style={styles.buttonText}>Join Tournament</Text>
              </TouchableOpacity>
            )
          ) : (
            <TouchableOpacity></TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {tournament.status === "completed" && (
          <View style={styles.winnerContainer}>
            <Text
              style={styles.winnerText}
            >{`Winner: ${tournament.winner_team_name}`}</Text>
          </View>
        )}
        <FlatList
          data={Object.keys(groupedMatches)}
          renderItem={({ item }) => (
            <View style={styles.roundContainer}>
              <Text style={styles.roundText}>Round {item}</Text>
              {groupedMatches[item].map((match) => (
                <View key={match.id} style={styles.card}>
                  <Text
                    style={styles.matchTitle}
                  >{`${match.firstTeam} vs ${match.secondTeam}`}</Text>
                  <Text style={styles.matchDate}>{`Date: ${
                    match.date || "TBD"
                  }`}</Text>
                  <Text
                    style={styles.matchStatus}
                  >{`Status: ${match.status}`}</Text>
                  {match.status === "completed" && (
                    <Text
                      style={styles.matchWinner}
                    >{`Winner: ${match.winnerTeam}`}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.flatList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    padding: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  tournamentInfo: {
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  statusContainer: {
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    padding: 4,
  },
  statusText: {
    color: "#05a759",
    fontSize: 16,
  },
  details: {
    marginTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButton: {
    backgroundColor: "#05a759",
    marginRight: 8,
  },
  leaveButton: {
    backgroundColor: "#d9534f",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  winnerContainer: {
    backgroundColor: "#2e2e2e",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  winnerText: {
    color: "#05a759",
    fontSize: 18,
    textAlign: "center",
  },
  roundContainer: {
    marginBottom: 16,
  },
  roundText: {
    color: "#05a759",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  matchTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  matchDate: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 4,
  },
  matchStatus: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 4,
  },
  matchWinner: {
    color: "#05a759",
    fontSize: 16,
    marginTop: 4,
  },
  flatList: {
    paddingBottom: 16,
  },
  teamContainer: {
    marginTop: 16,
  },
  teamTitle: {
    color: "#05a759",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  teamName: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 4,
  },
});

export default TournamentInfoScreen;
