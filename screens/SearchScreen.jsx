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
  const [searchResults, setSearchResults] = useState([]);

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
        setSearchResults(response.data);
        console.log("Search Results:", response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setSearchResults([]);
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
        {searchResults && searchResults.length > 0 ? (
          <SearchCards
            data={searchResults}
            onPress={(profileType, id) => navigateToProfile(profileType, id)}
          />
        ) : (
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
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#fff",
  },
});

export default SearchScreen;
