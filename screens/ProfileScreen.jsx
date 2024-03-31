import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// Import dummy data
import {
  dummyPlayers,
  dummyClubs,
  dummyTeams,
  dummyTournaments,
} from "../Data/dummyData";

const ProfileScreen = ({ route }) => {
  const { profileType, profileId } = route.params;
  let profileData;

  // Fetch profile data based on profileType and profileId
  switch (profileType) {
    case "player":
      profileData = dummyPlayers.find((player) => player.id === profileId);
      break;
    case "club":
      profileData = dummyClubs.find((club) => club.id === profileId);
      break;
    case "team":
      profileData = dummyTeams.find((team) => team.id === profileId);
      break;
    case "tournament":
      profileData = dummyTournaments.find(
        (tournament) => tournament.id === profileId
      );
      break;
    default:
      profileData = null;
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text>Error: Profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile header */}
      <View style={styles.header}>
        <Image source={profileData.photo} style={styles.profilePhoto} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{profileData.name}</Text>
          {profileData.type === "player" && (
            <>
              <Text style={styles.info}>Age: {profileData.age}</Text>
              <Text style={styles.info}>
                Games Played: {profileData.gamesPlayed}
              </Text>
              <Text style={styles.info}>Team: {profileData.team}</Text>
              <TouchableOpacity style={styles.inviteButton} onPress={() => {}}>
                <Text>Invite to Team</Text>
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Trophies</Text>
              {profileData.trophies.map((trophy, index) => (
                <Text key={index}>{trophy}</Text>
              ))}
            </>
          )}
          {profileData.type === "team" && (
            <Text style={styles.info}>Sport: {profileData.sport}</Text>
          )}
        </View>
      </View>

      {/* Profile photos */}
      <ScrollView horizontal={true} style={styles.profilePhotos}>
        {profileData.profilePhotos &&
          profileData.profilePhotos.map((photo, index) => (
            <TouchableOpacity key={index} onPress={() => {}}>
              <Image source={photo} style={styles.photo} />
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Additional profile information for club and tournament */}
      {profileData.type === "club" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Club Details</Text>
          <Text>Name: {profileData.name}</Text>
          <Text>City: {profileData.city}</Text>
          <Text>Country: {profileData.country}</Text>
          {/* Add more club details as needed */}
        </View>
      )}

      {profileData.type === "tournament" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tournament Details</Text>
          <Text>Name: {profileData.name}</Text>
          <Text>Sport: {profileData.sport}</Text>
          <Text>City: {profileData.city}</Text>
          <Text>Country: {profileData.country}</Text>
          {/* Add more tournament details as needed */}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  info: {
    fontSize: 16,
    color: "#555",
  },
  profilePhotos: {
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inviteButton: {
    backgroundColor: "#E91E63",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default ProfileScreen;
