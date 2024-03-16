import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const SearchBar = () => {
  const navigation = useNavigation();

  const handleSearchPress = () => {
    navigation.navigate("Search");
  };

  return (
    <TouchableOpacity onPress={handleSearchPress}>
      <View
        style={[styles.searchBar, Platform.OS === "ios" && styles.iosShadow]}
      >
        <Icon
          name="search"
          size={20}
          color="#05a759"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.searchText}>Search for sports, games...</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#333333",
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchText: {
    color: "gray",
    fontSize: 16,
  },
});

export default SearchBar;
