import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axiosInstance from "../utils/axios"; // if using Axios for HTTP requests
import { useNavigation } from "@react-navigation/native"; // for navigation

const TournamentsScreen = () => {
  const navigation = useNavigation();
  const [tournaments, setTournaments] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axiosInstance.get("/tournament/all");
      setTournaments(response.data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const navigateToTournamentInfo = (tournamentId) => {
    // Navigate to tournament info screen with the tournament ID
    navigation.navigate("TournamentInfo", { tournamentId });
  };

  const renderTournamentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToTournamentInfo(item.id)}
    >
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text>{`Start Date: ${item.start_date}`}</Text>
      <Text>{`End Date: ${item.end_date}`}</Text>
      <Text>{`Max Teams: ${item.max_teams}`}</Text>
      <Text>{`Entry Fees: ${item.entry_fees}`}</Text>
      <Text>{`Status: ${item.status}`}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>Tournaments Screen</Text>
        <FlatList
          data={tournaments}
          renderItem={renderTournamentCard}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default TournamentsScreen;
