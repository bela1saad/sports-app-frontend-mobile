import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import dummy data
import {
  dummyPlayers,
  dummyClubs,
  dummyTeams,
  dummyTournaments,
} from "../Data/dummyData";

const ProfileScreen = ({ route }) => {
  const { profileType, profileId } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    // Fetch profile data based on profileType and profileId
    switch (profileType) {
      case "player":
        setProfileData(dummyPlayers.find((player) => player.id === profileId));
        break;
      case "club":
        setProfileData(dummyClubs.find((club) => club.id === profileId));
        break;
      case "team":
        setProfileData(dummyTeams.find((team) => team.id === profileId));
        break;
      case "tournament":
        setProfileData(
          dummyTournaments.find((tournament) => tournament.id === profileId)
        );
        break;
      default:
        setProfileData(null);
    }
  }, [navigation, profileId, profileType]);

  const navigateToProfilePhotos = () => {
    // Navigate to the ProfilePhotosScreen with profile data
    navigation.navigate("ProfilePhotos", { photos: profileData.profilePhotos });
  };

  const handleAddFriend = () => {
    setIsFriend(true);
    // Perform actions to add friend
  };

  const handleRemoveFriend = () => {
    setIsFriend(false);
    // Perform actions to remove friend
  };

  if (!profileData) {
    return (
      <View style={[styles.container, { backgroundColor: "#1a1a1a" }]}>
        <Text style={styles.errorText}>Error: Profile not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: "#1a1a1a", padding: 20 },
      ]}
    >
      {/* Profile header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={navigateToProfilePhotos}>
          <Image source={profileData.photo} style={styles.profilePhoto} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.name}>
            {profileData.type === "player"
              ? profileData.username
              : profileData.name}
          </Text>
          {profileData.type === "player" && (
            <View style={styles.buttonContainer}>
              {!isFriend ? (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#05a759" }]}
                  onPress={handleAddFriend}
                >
                  <Text style={styles.buttonText}>Add Friend</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#E91E63" }]}
                  onPress={handleRemoveFriend}
                >
                  <Text style={styles.buttonText}>Remove Friend</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#05a759" }]}
                onPress={() => {}}
              >
                <Text style={styles.buttonText}>Invite to Team</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Additional profile information */}
      {profileData.type === "player" && (
        <View style={styles.playerInfoContainer}>
          <View style={styles.infoContainer}>
            <Icon name="cake" size={20} color="#aaa" />
            <Text style={styles.info}>{profileData.age}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="soccer" size={20} color="#aaa" />
            <Text style={styles.info}>{profileData.gamesPlayed}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="account-group" size={20} color="#aaa" />
            <Text style={styles.info}>{profileData.team}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Icon name="trophy" size={20} color="#aaa" />
            <View style={styles.trophyContainer}>
              {profileData.trophies.map((trophy, index) => (
                <Text key={index} style={styles.trophy}>
                  {trophy}
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Additional profile information for club and tournament */}
      {(profileData.type === "club" || profileData.type === "tournament") && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {profileData.type === "club" ? "Club" : "Tournament"} Details
          </Text>
          <Text style={styles.info}>Name: {profileData.name}</Text>
          <Text style={styles.info}>City: {profileData.city}</Text>
          <Text style={styles.info}>Country: {profileData.country}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 40 : 20,
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
    color: "#fff",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  playerInfoContainer: {
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 5,
  },
  trophyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  trophy: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#05a759",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  errorText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default ProfileScreen;
