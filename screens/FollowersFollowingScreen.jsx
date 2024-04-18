import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  dummyPlayers,
  dummyTeams,
  dummyClubs,
  dummyTournaments,
} from "../Data/dummyData";

const FollowersFollowingScreen = () => {
  // Dummy followers and following data
  const followers = dummyPlayers.filter((player) => player.id === 1)[0]
    .followersP;
  const following = dummyPlayers.filter((player) => player.id === 1)[0]
    .followingP;

  // Render follower or following item
  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer}>
      <Text>{item.username}</Text>
      {/* Add more user info here */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Followers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Followers</Text>
        <FlatList
          data={followers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
        />
      </View>
      {/* Following */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Following</Text>
        <FlatList
          data={following}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default FollowersFollowingScreen;
