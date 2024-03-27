import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Keyboard,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSearch,
  faArrowLeft,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

// Import the SearchCards component
import SearchCards from "../components/SearchCards";
import {
  dummyPlayers,
  dummyClubs,
  dummyTeams,
  dummyTournaments,
} from "../Data/dummyData";

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Function to handle search query change
  const handleSearchQueryChange = (query) => {
    console.log("Search Query Changed:", query);
    setSearchQuery(query);
  };

  // Function to handle search
  const handleSearch = () => {
    console.log("Search Query:", searchQuery);
    const results = filterData();
    console.log("Results:", results);
    setSearchResults(results);
  };

  // Function to filter all data based on search query
  const filterData = () => {
    const filteredData = [];
    const allData = [dummyPlayers, dummyClubs, dummyTeams, dummyTournaments];
    allData.forEach((data) => {
      filteredData.push(
        ...data.filter(
          (item) =>
            item.name &&
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    });
    return filteredData;
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          {/* Adjusting the size of the back button icon */}
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
            fontSize={16}
          />
        </View>
      </View>
      {searchResults.length > 0 && (
        <ScrollView style={styles.resultsContainer}>
          <SearchCards
            data={searchResults}
            onPress={(item) => console.log(item)}
          />
        </ScrollView>
      )}
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
    marginTop: 12,
  },
  backButton: {
    marginRight: 12,
  },
  // Adjusting the size of the back button icon
  backIcon: {
    color: "#05a759",
    fontSize: 24, // Increase the font size for a bigger icon
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
    fontSize: 16,
    marginLeft: 8,
    paddingVertical: 12,
  },
  resultsContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
});

export default SearchScreen;
