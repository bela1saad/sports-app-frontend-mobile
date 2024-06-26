import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import axiosInstance from "../utils/axios";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Using MaterialCommunityIcons for icons

const TournamentsScreen = () => {
  const navigation = useNavigation();
  const [tournaments, setTournaments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTournaments, setFilteredTournaments] = useState([]);

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
      setFilteredTournaments(response.data); // Initialize filtered tournaments with all tournaments
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const navigateToTournamentInfo = (tournamentId) => {
    navigation.navigate("TournamentInfo", { tournamentId });
  };

  const navigateToMyTournaments = () => {
    navigation.navigate("MyTournaments");
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = tournaments.filter((tournament) =>
      tournament.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTournaments(filtered);
  };

  const renderTournamentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToTournamentInfo(item.id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Icon name="trophy" size={24} color="#05a759" />
      </View>
      <View style={styles.cardInfo}>
        <Icon name="calendar-start" size={18} color="#05a759" />
        <Text style={styles.cardText}>{`Start Date: ${item.start_date}`}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Icon name="calendar-end" size={18} color="#05a759" />
        <Text style={styles.cardText}>{`End Date: ${item.end_date}`}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Icon name="account-group" size={18} color="#05a759" />
        <Text style={styles.cardText}>{`Max Teams: ${item.max_teams}`}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Icon name="currency-usd" size={18} color="#05a759" />
        <Text style={styles.cardText}>{`Entry Fees: ${item.entry_fees}`}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Icon name="information" size={18} color="#05a759" />
        <Text style={styles.cardText}>{`Status: ${item.status}`}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Tournaments</Text>
        <TouchableOpacity
          onPress={navigateToMyTournaments}
          style={styles.button}
        >
          <Icon name="account" size={24} color="#fff" />
          <Text style={styles.buttonText}>My Tournaments</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#ccc" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tournaments..."
          placeholderTextColor="#ccc"
          onChangeText={handleSearch}
          value={searchQuery}
        />
      </View>

      <FlatList
        data={filteredTournaments}
        renderItem={renderTournamentCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#05a759",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  flatListContent: {
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#ccc",
    fontSize: 16,
  },
});

export default TournamentsScreen;
