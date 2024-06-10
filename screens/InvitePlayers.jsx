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
  Alert,
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
  const [sports, setSports] = useState([]);
  const [chosenSport, setChosenSport] = useState("");
  const [showSportPicker, setShowSportPicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide default header
    });
  }, [navigation]);

  useEffect(() => {
    fetchPlayers();
    fetchSports();
  }, []);

  useEffect(() => {
    filterPlayers();
  }, [players, searchQuery, chosenSport]);

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

  const fetchSports = async () => {
    try {
      const response = await axiosInstance.get("/sport/all");
      if (response.status === 200 && response.data) {
        setSports(response.data);
      }
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const filterPlayers = () => {
    let filtered = players.filter((player) => {
      const nameMatch = player.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const sportMatch = !chosenSport || player.sport_id === chosenSport.id;
      return nameMatch && sportMatch;
    });
    setFilteredPlayers(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSelectSport = (sportId) => {
    const selectedSport = sports.find(
      (sport) => sport.id === parseInt(sportId, 10)
    );

    if (selectedSport) {
      setChosenSport(selectedSport);
      setShowSportPicker(false);
    } else {
      console.log("Sport not found");
    }
  };

  const handleInvitePress = async (playerId) => {
    try {
      const response = await axiosInstance.post(
        `/request/team/invite/${playerId}`,
        {
          message: "Team invitation sent successfully",
        }
      );
      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success", "Invitation sent successfully!");
      } else {
        Alert.alert("Error", "Failed to send invitation. Please try again.");
      }
    } catch (error) {
      console.error("Error inviting player:", error);
      Alert.alert("Error", "Failed to send invitation. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <PlayerCard player={item} onInvitePress={handleInvitePress} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Invite Players" />
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search players..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowSportPicker(true)}
          >
            <Text style={styles.pickerButtonText}>
              {chosenSport ? chosenSport.name : "Choose a sport"}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={showSportPicker}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowSportPicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Sport</Text>
                <Picker
                  selectedValue={chosenSport.id}
                  onValueChange={(itemValue) => handleSelectSport(itemValue)}
                >
                  <Picker.Item label="Select Sport" value="" />
                  {sports.map((sport) => (
                    <Picker.Item
                      label={sport.name}
                      value={sport.id}
                      key={sport.id}
                    />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowSportPicker(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
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

const { width } = Dimensions.get("window");

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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#303030",
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#303030",
  },
  pickerButtonText: {
    color: "#05a759",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: width * 0.8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#05a759",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
