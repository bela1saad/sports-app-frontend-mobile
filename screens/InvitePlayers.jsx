import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  Dimensions,
} from "react-native";
import axiosInstance from "../utils/axios";
import { Picker } from "@react-native-picker/picker";
import { useLayoutEffect } from "react";
import PlayerCard from "../components/PlayerCard";

// Custom Header Component
const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const InvitePlayersScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide default header
    });
  }, [navigation]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    filterPlayers();
  }, [players, searchQuery]);

  const fetchPlayers = async () => {
    try {
      const response = await axiosInstance.get("/player/all");
      if (response.status === 200 && response.data) {
        setPlayers(response.data);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const filterPlayers = () => {
    let filtered = players.filter((player) => {
      return player.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredPlayers(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleInvitePress = async (playerId) => {
    try {
      const response = await axiosInstance.post(
        `/request/team/invite/${playerId}`,
        {
          message: "Team invitation sent successfully",
        }
      );
      console.log("Invite successful:", response.data);
      // Add logic to handle successful invitation
    } catch (error) {
      console.error("Error inviting player:", error);
      // Add logic to handle error
    }
  };

  const renderItem = ({ item }) => (
    <PlayerCard player={item} onInvitePress={handleInvitePress} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Invite Players" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search players..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <FlatList
          data={filteredPlayers}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.playerList}
          ListEmptyComponent={
            <Text style={styles.noPlayersText}>No players found.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#101010",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    backgroundColor: "#05a759",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    elevation: 8, // Add elevation for shadow effect
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#303030",
  },
  playerList: {
    paddingBottom: 20,
  },
  noPlayersText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default InvitePlayersScreen;
