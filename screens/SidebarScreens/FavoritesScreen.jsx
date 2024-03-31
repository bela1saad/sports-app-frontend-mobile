import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const FavoritesScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Dummy data for favorites list
  const [favorites, setFavorites] = useState({
    teams: [
      { id: 1, name: "Team A", logo: require("../../assets/user_photo.jpg") },
      { id: 2, name: "Team B", logo: require("../../assets/user_photo.jpg") },
      { id: 3, name: "Team C", logo: require("../../assets/user_photo.jpg") },
    ],
    clubs: [
      { id: 1, name: "Club X", logo: require("../../assets/user_photo.jpg") },
      { id: 2, name: "Club Y", logo: require("../../assets/user_photo.jpg") },
      { id: 3, name: "Club Z", logo: require("../../assets/user_photo.jpg") },
    ],
  });

  const goBack = () => {
    navigation.goBack();
  };

  const navigateToProfile = (item) => {
    // Navigate to the item's profile screen
    console.log("Navigating to", item.name, "'s profile");
  };

  const removeFromFavorites = (section, itemId, itemName) => {
    Alert.alert(
      "Confirm",
      `Are you sure you want to remove ${itemName} from favorites?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () =>
            setFavorites((prevFavorites) => ({
              ...prevFavorites,
              [section]: prevFavorites[section].filter(
                (item) => item.id !== itemId
              ),
            })),
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item, index, section }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => navigateToProfile(item)}
    >
      <Image source={item.logo} style={styles.itemLogo} />
      <Text style={styles.itemName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromFavorites(section, item.id, item.name)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-back" size={24} color="#05a759" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={styles.backButton}></View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teams</Text>
        <FlatList
          data={favorites.teams}
          renderItem={({ item, index }) =>
            renderFavoriteItem({ item, index, section: "teams" })
          }
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clubs</Text>
        <FlatList
          data={favorites.clubs}
          renderItem={({ item, index }) =>
            renderFavoriteItem({ item, index, section: "clubs" })
          }
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#05a759",
    fontSize: 24,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  itemName: {
    color: "#ffffff",

    flex: 1,
  },
  removeButton: {
    backgroundColor: "#d32f2f",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#ffffff",
  },
});

export default FavoritesScreen;
