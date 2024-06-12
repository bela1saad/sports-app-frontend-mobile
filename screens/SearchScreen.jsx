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
import Icon from "react-native-vector-icons/FontAwesome";
import SearchCards from "../components/SearchCards";
import axiosInstance from "../utils/axios";

const window = Dimensions.get("window");

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    players: [],
    teams: [],
    clubs: [],
    tournaments: [],
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSearchQueryChange = (query) => {
    setSearchQuery(query);
  };

  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const response = await axiosInstance.get(`/search?term=${searchQuery}`);
        const results = response.data;
        const players = results.filter((item) => item.type === "player");
        const teams = results.filter((item) => item.type === "team");
        const clubs = results.filter((item) => item.type === "club");
        const tournaments = results.filter(
          (item) => item.type === "tournament"
        );

        setSearchResults({ players, teams, clubs, tournaments });
        console.log("Search Results:", results);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setSearchResults({ players: [], teams: [], clubs: [], tournaments: [] });
    }
  };

  const navigateToProfile = (profileType, id) => {
    navigation.navigate("Profile", { profileType, id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" style={styles.backIcon} size={24} />
        </TouchableOpacity>
        <View style={styles.inputContainer}>
          <Icon name="search" style={styles.searchIcon} size={20} />
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
        {searchResults.players.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Players</Text>
            <SearchCards
              data={searchResults.players}
              onPress={(profileType, id) => navigateToProfile(profileType, id)}
            />
          </>
        )}
        {searchResults.teams.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Teams</Text>
            <SearchCards
              data={searchResults.teams}
              onPress={(profileType, id) => navigateToProfile(profileType, id)}
            />
          </>
        )}
        {searchResults.clubs.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Clubs</Text>
            <SearchCards
              data={searchResults.clubs}
              onPress={(profileType, id) => navigateToProfile(profileType, id)}
            />
          </>
        )}
        {searchResults.tournaments.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tournaments</Text>
            <SearchCards
              data={searchResults.tournaments}
              onPress={(profileType, id) => navigateToProfile(profileType, id)}
            />
          </>
        )}
        {searchResults.players.length === 0 &&
          searchResults.teams.length === 0 &&
          searchResults.clubs.length === 0 &&
          searchResults.tournaments.length === 0 && (
            <Text style={styles.noResultsText}>No results found</Text>
          )}
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
    fontSize: window.width < 400 ? 16 : 20,
    marginLeft: 8,
    paddingVertical: 12,
  },
  resultsContainer: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#fff",
  },
});

export default SearchScreen;
