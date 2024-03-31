import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SearchCards from "../components/SearchCards";
import {
  dummyPlayers,
  dummyClubs,
  dummyTeams,
  dummyTournaments,
} from "../Data/dummyData";

const window = Dimensions.get("window");

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
  };

  const handleSearch = () => {
    if (searchQuery) {
      const results = filterData();
      setSearchResults(results);
    } else {
      setSearchResults([]); // Reset search results if search query is empty
    }
  };

  const navigateToProfile = (profileType, id) => {
    // Assuming you have a separate screen for displaying profiles
    // You can replace 'ProfileScreen' with the actual screen name
    navigation.navigate("Profile", { profileType, id });
  };

  const filterData = () => {
    const filteredResults = [];

    // Filter players
    const filteredPlayers = dummyPlayers.filter((player) =>
      player.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredPlayers.length > 0) {
      filteredResults.push({ title: "Players", data: filteredPlayers });
    }

    // Filter clubs
    const filteredClubs = dummyClubs.filter((club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredClubs.length > 0) {
      filteredResults.push({ title: "Clubs", data: filteredClubs });
    }

    // Filter teams
    const filteredTeams = dummyTeams.filter((team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredTeams.length > 0) {
      filteredResults.push({ title: "Teams", data: filteredTeams });
    }

    // Filter tournaments
    const filteredTournaments = dummyTournaments.filter((tournament) =>
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredTournaments.length > 0) {
      filteredResults.push({ title: "Tournaments", data: filteredTournaments });
    }

    return filteredResults;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            style={styles.backIcon}
            size={24}
          />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={styles.input}
            autoCapitalize="none"
            autoFocus={true}
          />
        </View>
      </View>
      <ScrollView style={styles.resultsContainer}>
        {searchResults.map((section) => (
          <View key={section.title}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            <SearchCards
              data={section.data}
              onPress={(profileType, id) => navigateToProfile(profileType, id)}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: Platform.OS === "ios" ? 44 : 12,
  },
  backButton: {
    marginRight: 12,
  },
  backIcon: {
    color: "#05a759",
    fontSize: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    paddingLeft: 12,
  },
  searchIcon: {
    color: "#05a759",
  },
  input: {
    flex: 1,
    color: "#333",
    fontSize: window.width < 400 ? 16 : 20, // Adjust font size based on window width
    marginLeft: 8,
    paddingVertical: 12,
  },
  resultsContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 15, // Add margin to create space
  },
  sectionHeader: {
    backgroundColor: "#444",
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SearchScreen;
