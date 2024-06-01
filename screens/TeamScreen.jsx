import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView, // Import SafeAreaView
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axiosInstance from "../utils/axios";
import COLORS from "../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LineupGrid from "../components/LineupGrid";
import NotificationsIcon from "../components/NotificationsIcon";

const TeamScreen = ({ route }) => {
  const navigation = useNavigation();
  const [team, setTeam] = useState(null);
  const [sport, setSport] = useState(null);
  const [error, setError] = useState(null);
  const [isCaptain, setIsCaptain] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [lineup, setLineup] = useState([]);
  const notificationCount = 100;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/team/");
        if (response.status === 200 && response.data.team) {
          const teamData = response.data.team;
          setTeam(teamData);
          fetchSport(teamData.sport_id);
          checkIsCaptain();
          fetchFollowers(teamData.id);
          fetchLineup(teamData.id);
        } else if (response.status === 404) {
          setTeam(false);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.message === "Player is not in a team"
        ) {
          setTeam(false);
        } else {
          setError("An error occurred. Please try again.");
        }
      }
    };

    const fetchSport = async (sportId) => {
      try {
        const response = await axiosInstance.get(`/sport/by-id/${sportId}`);
        if (response.status === 200 && response.data) {
          setSport(response.data);
        }
      } catch (error) {
        console.error("Error fetching sport data:", error);
      }
    };

    const fetchFollowers = async (teamId) => {
      try {
        const response = await axiosInstance.get(
          `/follow/followers-count/${teamId}`
        );
        if (response.status === 200 && response.data) {
          setFollowers(response.data.followersCount);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    const fetchLineup = async (teamId) => {
      try {
        const response = await axiosInstance.get(`/lineup/${teamId}`);
        if (response.status === 200 && response.data) {
          setLineup(response.data.lineup); // Make sure to set lineup state correctly
        }
      } catch (error) {
        console.error("Error fetching lineup:", error);
      }
    };

    const checkIsCaptain = async () => {
      try {
        const response = await axiosInstance.get("/player/isTeamCaptain");
        if (response.status === 200 && response.data.isCaptain) {
          setIsCaptain(true);
          console.log("User is a captain of the team");
        } else {
          setIsCaptain(false);
          console.log("User is not a captain of the team");
        }
      } catch (error) {
        console.error("Error checking captain status:", error);
      }
    };

    fetchData();
  }, [route.params]);

  const handleEditTeam = () => {
    navigation.navigate("EditTeamScreen");
  };

  const renderLineupItem = ({ item }) => (
    <View style={styles.lineupItem}>
      <Image source={{ uri: item.player.pic }} style={styles.playerImage} />
      <View style={styles.lineupTextContainer}>
        <Text style={styles.lineupItemText}>{item.player.name}</Text>
        <Text style={styles.positionText}>{item.position.name}</Text>
      </View>
    </View>
  );

  const getSportIcon = (sportName) => {
    switch (sportName) {
      case "Football":
        return "soccer";
      case "Basketball":
        return "basketball";
      case "Tennis":
        return "tennis";
      default:
        return "help-circle";
    }
  };
  const getLevelIcon = (level) => {
    switch (level) {
      case "Excellent":
        return "star"; // Icon for excellent
      case "Intermediate":
        return "star"; // Icon for intermediate
      case "Good":
        return "star"; // Icon for good
      case "Beginner":
        return "star"; // Icon for beginner
      default:
        return "help-circle";
    }
  };

  const getLevelIconColor = (level) => {
    switch (level) {
      case "Excellent":
        return "#FF0000"; // Red color for excellent
      case "Intermediate":
        return "#C0C0C0"; // Silver color for intermediate
      case "Good":
        return "#FFD700"; // Gold color for good
      case "Beginner":
        return "#0077CC"; // Blue color for beginner
      default:
        return COLORS.primary; // Default color
    }
  };

  const getUpForGameIcon = (upForGame) => {
    return upForGame ? "check-circle" : "close-circle";
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (team === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!team) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.noTeamText}>You don't have a team yet.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CreateTeamScreen")}
          >
            <Text style={styles.buttonText}>Create a Team</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>or</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("JoinTeamScreen")}
          >
            <Text style={styles.buttonText}>Join a Team</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image
          source={{ uri: team.pic }}
          style={styles.teamImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}
          style={[styles.notificationIconContainer, styles.notificationIcon]}
        >
          <NotificationsIcon count={notificationCount} size={30} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.teamName}>{team.name}</Text>
          {isCaptain && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditTeam}
            >
              <Icon name="pencil" size={15} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Followers</Text>
            <Text style={styles.infoText}>{followers}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Level</Text>
            <Icon
              name={getLevelIcon(team.level)}
              size={24}
              color={getLevelIconColor(team.level)}
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Up for a Game</Text>
            <Icon
              name={getUpForGameIcon(team.up_for_game)}
              size={24}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sport</Text>
            {sport ? (
              <Icon
                name={getSportIcon(sport.name)}
                size={24}
                color={COLORS.primary}
              />
            ) : (
              <Text style={styles.infoText}>Loading...</Text>
            )}
          </View>
        </View>
        <Text style={styles.teamDescription}>{team.description}</Text>

        <View style={styles.lineupContainer}>
          <Text style={styles.lineupTitle}>Lineup</Text>
          {lineup.map((player, index) => (
            <View key={index} style={styles.playerContainer}>
              <Image
                source={{ uri: player.player.pic }}
                style={styles.playerPhoto}
              />
              <View style={styles.playerInfo}>
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      navigateToProfile("player", player.player_id)
                    }
                  >
                    <Text style={styles.playerName}>
                      {player.player.name}
                      {player.isCaptain && (
                        <Icon
                          name="star"
                          size={24}
                          color="#FFD700"
                          style={styles.captainIcon}
                        />
                      )}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.playerPosition}>
                    {player.position.name}
                  </Text>
                </View>
                <View style={styles.jerseyNumberContainer}>
                  <Text style={styles.jerseyNumberText}>
                    {player.jerseyNumber}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.lineupGrid}>
          <LineupGrid lineup={lineup} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#101010",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  notificationIcon: {
    paddingHorizontal: 6,
    paddingVertical: -10,
    borderRadius: 10,
    marginLeft: 5,

    zIndex: 1,
  },
  notificationIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 20,
    right: 20,
  },

  teamImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  teamName: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingVertical: 10,
  },
  infoItem: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.white,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
  teamDescription: {
    fontSize: 16,
    color: "white",
    lineHeight: 22,
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: COLORS.Green,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  editButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    position: "absolute",
    top: -1,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
  },
  noTeamText: {
    fontSize: 18,
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  orText: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 10,
    textAlign: "center",
  },
  lineupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  lineupContainer: {
    width: "100%",
  },
  lineupItem: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  lineupTextContainer: {
    flex: 1,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  lineupItemText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "bold",
  },
  positionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  lineupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: windowHeight * 0.01, // Add margin bottom to provide space for other elements below
    paddingHorizontal: 10, // Add horizontal padding to adjust spacing
    alignItems: "center", // Center items vertically
  },
});

export default TeamScreen;
