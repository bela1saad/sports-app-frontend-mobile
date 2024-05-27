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
import TeamCard from "../components/TeamCard";

// Custom Header Component
const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const JoinTeamScreen = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
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
    fetchTeams();
    fetchSports();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [teams, searchQuery, chosenSport]);

  const fetchTeams = async () => {
    try {
      const response = await axiosInstance.get("/team/all");
      if (response.status === 200 && response.data.teams) {
        setTeams(response.data.teams);
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

  const filterTeams = () => {
    let filtered = teams.filter((team) => {
      const nameMatch = team.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const sportMatch = !chosenSport || team.sport_id === chosenSport.id;
      return nameMatch && sportMatch;
    });
    setFilteredTeams(filtered);
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

  const handleJoinPress = (teamId) => {
    console.log("Join team with ID:", teamId);
  };

  const renderItem = ({ item }) => (
    <TeamCard team={item} onJoinPress={handleJoinPress} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Join a Team" />
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search teams..."
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
          data={filteredTeams}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.teamList}
          ListEmptyComponent={
            <Text style={styles.noTeamsText}>No teams found.</Text>
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
  teamList: {
    paddingBottom: 20,
  },
  noTeamsText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default JoinTeamScreen;
