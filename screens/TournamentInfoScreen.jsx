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
  const [teamNames, setTeamNames] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchTournamentInfo();
    fetchParticipatedTournaments(); // Fetch tournaments the player is participating in
  }, []);

  // Use useFocusEffect to refresh data on screen focus
  useFocusEffect(
    React.useCallback(() => {
      fetchTournamentInfo();
      fetchParticipatedTournaments();
    }, [])
  );

  useEffect(() => {
    // Only fetch team names when tournament and participatedTournaments are fetched
    if (tournament && participatedTournaments.length > 0) {
      fetchTeamNames();
    }
  }, [tournament, participatedTournaments]);

  const fetchTournamentInfo = async () => {
    try {
      const response = await axiosInstance.get(
        `/tournament/by-id/${tournamentId}`
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
    const names = {};
    try {
      if (tournament.winner_team_id) {
        names[tournament.winner_team_id] = await fetchTeamInfo(
          tournament.winner_team_id
        );
      }
      for (const match of tournament.matches) {
        if (!names[match.first_team_id]) {
          names[match.first_team_id] = await fetchTeamInfo(match.first_team_id);
        }
        if (!names[match.second_team_id]) {
          names[match.second_team_id] = await fetchTeamInfo(
            match.second_team_id
          );
        }
      }
      setTeamNames(names);
    } catch (error) {
      console.error("Error fetching team names:", error);
    }
  };

  const fetchTeamInfo = async (teamId) => {
    try {
      const response = await axiosInstance.get(`/team/by-team/${teamId}`);
      return response.data.name; // Assuming the response contains a 'name' field for the team
    } catch (error) {
      console.error("Error fetching team info:", error);
      return "Team Name"; // Default name or handle error as per your app's logic
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

  const renderMatchCard = ({ item }) => {
    const firstTeamName = teamNames[item.first_team_id] || "Team Name";
    const secondTeamName = teamNames[item.second_team_id] || "Team Name";
    const winnerTeamName = teamNames[item.winner_team_id] || "Team Name";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Round {item.round}</Text>
          <Icon name="calendar" size={24} color="#05a759" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardText}>
            {firstTeamName} vs {secondTeamName}
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
            <Text style={styles.cardText}>{`Winner: ${winnerTeamName}`}</Text>
          </View>
        )}
      </View>
    );
  };

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
            <Text style={styles.winnerText}>{`Winner: ${
              teamNames[tournament.winner_team_id] || "Team Name"
            }`}</Text>
          </View>
        )}
        <FlatList
          data={Object.keys(groupedMatches)}
          renderItem={({ item }) => (
            <View style={styles.roundContainer}>
              <Text style={styles.roundText}>Round {item}</Text>
              {groupedMatches[item].map((match) => (
                <View key={match.id} style={styles.card}>
                  <Text style={styles.matchTitle}>{`${
                    teamNames[match.first_team_id] || "Team Name"
                  } vs ${
                    teamNames[match.second_team_id] || "Team Name"
                  }`}</Text>
                  <Text style={styles.matchDate}>{`Date: ${
                    match.date || "TBD"
                  }`}</Text>
                  <Text
                    style={styles.matchStatus}
                  >{`Status: ${match.status}`}</Text>
                  {match.status === "completed" && (
                    <Text style={styles.matchWinner}>{`Winner: ${
                      teamNames[match.winner_team_id] || "Team Name"
                    }`}</Text>
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
    backgroundColor: "#101010",
    paddingHorizontal: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  tournamentInfo: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  statusContainer: {
    backgroundColor: "#05a759",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 16,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    color: "#ccc",
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#05a759",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  joinButton: {
    backgroundColor: "#05a759",
  },
  leaveButton: {
    backgroundColor: "#FF6347",
  },
  flatList: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  cardText: {
    color: "#ccc",
    marginLeft: 8,
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
  matchTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  matchDate: {
    color: "#ccc",
    marginBottom: 4,
  },
  matchStatus: {
    color: "#ccc",
    marginBottom: 4,
  },
  matchWinner: {
    color: "#05a759",
  },
  winnerContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  winnerText: {
    color: "#05a759",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default TournamentInfoScreen;
