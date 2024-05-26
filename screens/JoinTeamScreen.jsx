import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import axiosInstance from "../utils/axios";
import { Picker } from "@react-native-picker/picker";

const JoinTeamScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sports, setSports] = useState([]);
  const [chosenSport, setChosenSport] = useState("");
  const [showSportPicker, setShowSportPicker] = useState(false);

  useEffect(() => {
    fetchTeams();
    fetchSports();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axiosInstance.get("/team/all");
      if (response.status === 200 && response.data.teams) {
        setTeams(response.data.teams);
        setFilteredTeams(response.data.teams);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  const handleSelectSport = (sportId) => {
    const selectedSport = sports.find(
      (sport) => sport.id === parseInt(sportId, 10)
    );

    if (selectedSport) {
      setChosenSport(selectedSport);
      const filtered = teams.filter((team) => team.sport_id === sportId);
      setFilteredTeams(filtered);
      setShowSportPicker(false);
    } else {
      console.log("Sport not found");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.teamItem}
      onPress={() => handleJoinPress(item.id)}
    >
      <Text style={styles.teamName}>{item.name}</Text>
      <Text style={styles.teamDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const handleJoinPress = (teamId) => {
    // Implement join logic here
    console.log("Join team with ID:", teamId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search teams..."
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
        data={filteredTeams}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <Text style={styles.noTeamsText}>No teams found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
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
  teamItem: {
    backgroundColor: "#303030",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },

  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#05a759",
    marginBottom: 5,
  },
  teamDescription: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
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
  noTeamsText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default JoinTeamScreen;
