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
import { useNavigation } from "@react-navigation/native";

const FollowersFollowingScreen = ({ route }) => {
  const { userId } = route.params; // Get the userId passed from navigation
  const navigation = useNavigation();

  console.log("userId:", userId); // Log userId to check its value

  // Find the user data based on userId
  const user = dummyPlayers.find((player) => player.id === userId);

  console.log("user:", user); // Log user data to check if it's found

  // Function to follow/unfollow a user
  const toggleFollow = (followUserId) => {
    // Implement follow/unfollow functionality here
    console.log("Toggled follow status for user:", followUserId);
  };

  // Function to block a follower
  const blockFollower = (followerId) => {
    // Implement block functionality here
    console.log("Blocked follower:", followerId);
  };

  const navigateToProfile = (profileType, id) => {
    console.log("Navigating to profile:", profileType, id); // Log navigation parameters
    navigation.navigate("Profile", { profileType, profileId: id });
  };

  // Render follower or following item
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigateToProfile(item.type, item.id)}
    >
      <Text>{item.username}</Text>
      {userId === user.id ? (
        // For user's following list, show unfollow button
        <TouchableOpacity onPress={() => toggleFollow(item.id)}>
          <Text>Unfollow</Text>
        </TouchableOpacity>
      ) : (
        // For user's followers list, show block button
        <TouchableOpacity onPress={() => blockFollower(item.id)}>
          <Text>Block</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Followers</Text>
        <FlatList
          data={user.followersP}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserItem}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Following</Text>
        <FlatList
          data={user.followingP}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
});

export default FollowersFollowingScreen;
