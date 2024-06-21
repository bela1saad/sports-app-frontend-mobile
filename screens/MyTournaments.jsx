import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axiosInstance from "../utils/axios";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const MyTournamentsScreen = () => {
  const navigation = useNavigation();
  const [tournaments, setTournaments] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchMyTournaments();
  }, []);

  const fetchMyTournaments = async () => {
    try {
      const response = await axiosInstance.get("/tournament/participated");
      setTournaments(response.data);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const navigateToTournamentInfo = (tournamentId) => {
    navigation.navigate("TournamentInfo", { tournamentId });
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
        <Text style={styles.screenTitle}>My Tournaments</Text>
      </View>
      <FlatList
        data={tournaments}
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
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
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
});

export default MyTournamentsScreen;
