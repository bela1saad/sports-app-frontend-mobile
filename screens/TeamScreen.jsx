import React, { useEffect, useState, useLayoutEffect, useMemo } from "react";
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
  Alert, // Import Alert
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
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
  const [members, setMembers] = useState([]); // State for team members
  const [positionKeys, setPositionKeys] = useState({});
  const notificationCount = 100;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const teamResponse = await axiosInstance.get("/team/");
          if (teamResponse.status === 200 && teamResponse.data.team) {
            const teamData = teamResponse.data.team;
            console.log("Fetched team data:", teamData); // Console log for team data
            setTeam(teamData);
            const sportResponse = await axiosInstance.get(
              `/sport/by-id/${teamData.sport_id}`
            );
            if (sportResponse.status === 200 && sportResponse.data) {
              setSport(sportResponse.data);
            }
            const followersResponse = await axiosInstance.get(
              `/follow/followers-count/${teamData.id}`
            );
            if (followersResponse.status === 200 && followersResponse.data) {
              setFollowers(followersResponse.data.followersCount);
            }
            const lineupResponse = await axiosInstance.get(
              `/lineup/${teamData.id}`
            );
            if (lineupResponse.status === 200 && lineupResponse.data) {
              setLineup(lineupResponse.data.lineup);
            }
            const isCaptainResponse = await axiosInstance.get(
              "/player/isTeamCaptain"
            );
            if (
              isCaptainResponse.status === 200 &&
              isCaptainResponse.data.isCaptain
            ) {
              setIsCaptain(true);
              console.log("User is a captain of the team");
            } else {
              setIsCaptain(false);
              console.log("User is not a captain of the team");
            }
            const membersResponse = await axiosInstance.get(
              `/team/current-members`
            );
            if (membersResponse.status === 200 && membersResponse.data) {
              setMembers(membersResponse.data);
              const keys = {};
              for (const member of membersResponse.data) {
                const positionResponse = await axiosInstance.get(
                  `/position/all`
                );
                if (positionResponse.status === 200 && positionResponse.data) {
                  const position = positionResponse.data.find(
                    (pos) => pos.id === member.position_id
                  );
                  if (position && position.key) {
                    keys[member.id] = position.key;
                  }
                }
              }
              setPositionKeys(keys);
            }
          } else if (teamResponse.status === 404) {
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

      fetchData();
    }, [route.params]) // Refresh data when route params change
  );

  const handleEditTeam = () => {
    navigation.navigate("EditTeamScreen");
  };

  const handleKickPlayer = (playerId) => {
    Alert.alert(
      "Kick Player",
      "Are you sure you want to kick this player from the team?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              console.log(`Kicking player with ID: ${playerId}`); // Log the player ID
              const response = await axiosInstance.put(
                `/team/kick/${playerId}`
              );
              if (response.status === 200) {
                // Remove the kicked player from the members list
                setMembers(members.filter((member) => member.id !== playerId));
                Alert.alert("Success", "Player has been kicked from the team");
              } else {
                console.error(`Unexpected response: ${response.status}`);
              }
            } catch (error) {
              console.error("Error kicking the player:", error); // Log the full error
              if (error.response) {
                console.error("Error data:", error.response.data); // Log error data
              }
              Alert.alert(
                "Error",
                "An error occurred while trying to kick the player. Please try again."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const fetchPositionKeys = async (members) => {
    try {
      const keys = {};
      for (const member of members) {
        const key = await fetchPositionKey(member.position_id); // Assuming fetchPositionKey function is defined
        keys[member.id] = key;
      }
      setPositionKeys(keys);
    } catch (error) {
      console.error("Error fetching position keys:", error);
    }
  };

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

  const handleTransferCaptain = (newCaptainId) => {
    Alert.alert(
      "Transfer Captain Role",
      "Are you sure you want to transfer the captain role to this player?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              console.log(
                `Transferring captain role to player with ID: ${newCaptainId}`
              ); // Log the player ID
              const response = await axiosInstance.put(
                `/team/transfer/${newCaptainId}`
              );
              if (response.status === 200) {
                // Assuming the API returns the updated team data with the new captain
                const updatedTeam = response.data.team;
                setTeam(updatedTeam);
                Alert.alert(
                  "Success",
                  "Captain role has been transferred successfully"
                );
              } else {
                console.error(`Unexpected response: ${response.status}`);
              }
            } catch (error) {
              console.error("Error transferring captain role:", error); // Log the full error
              if (error.response) {
                console.error("Error data:", error.response.data); // Log error data
              }
              Alert.alert(
                "Error",
                "An error occurred while trying to transfer the captain role. Please try again."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleInvitePlayers = () => {
    navigation.navigate("InvitePlayers");
  };

  const handleEditLineupTeam = () => {
    navigation.navigate("LineupEditScreen", { teamId: team.id });
  };

  // Function to handle leaving the team
  const handleLeaveTeam = async () => {
    Alert.alert(
      "Leave Team",
      "Are you sure you want to leave the team?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await axiosInstance.post(`/team/leave`);
              if (response.status === 200) {
                Alert.alert("Success", "Player left the team successfully", [
                  {
                    text: "OK",
                    onPress: () => {
                      // Navigate to home screen after leaving the team
                      navigation.navigate("MainTabs", { screen: "Home" });
                    },
                  },
                ]);
              }
            } catch (error) {
              console.error("Error leaving the team:", error);
              Alert.alert(
                "Error",
                "An error occurred while trying to leave the team. Please try again."
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
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
      <FlatList
        style={{ flex: 1 }} // Ensure FlatList takes full height
        contentContainerStyle={styles.flatListContent} // Added contentContainerStyle
        data={[{ key: "team" }]} // Dummy data to ensure FlatList works
        renderItem={({ item }) => (
          <>
            <Image
              source={{ uri: team.pic }}
              style={styles.teamImage}
              resizeMode="cover"
            />
            <View style={styles.header}>
              <Text style={styles.teamName}>{team.name}</Text>
              {isCaptain && (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Notifications")}
                  style={styles.notificationIconContainer}
                >
                  <NotificationsIcon count={notificationCount} size={30} />
                </TouchableOpacity>
              )}
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

            <View style={styles.section}>
              <View style={styles.teamMembersHeader}>
                <Text style={styles.sectionTitle}>Team Members</Text>
                {isCaptain && (
                  <TouchableOpacity
                    style={styles.inviteButton}
                    onPress={handleInvitePlayers}
                  >
                    {/* Icon for inviting players */}
                    <Icon name="account-plus" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                data={members}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.lineupItem}>
                    <Image
                      source={{ uri: item.pic }}
                      style={styles.playerImage}
                    />
                    <View style={styles.lineupTextContainer}>
                      <TouchableOpacity
                        onPress={() => navigateToProfile("player", item.id)}
                      >
                        <Text style={styles.lineupItemText}>{item.name}</Text>
                      </TouchableOpacity>
                      <Text style={styles.positionText}>
                        {positionKeys[item.id] || "Loading..."}
                      </Text>
                    </View>
                    {item.id === team.captain_id && (
                      <Icon
                        name="crown"
                        size={20}
                        color="gold"
                        style={styles.captainIcon}
                      />
                    )}
                    {isCaptain && item.id !== team.captain_id && (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.kickButton}
                          onPress={() => handleKickPlayer(item.id)}
                        >
                          <Icon name="account-remove" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.transferButton}
                          onPress={() => handleTransferCaptain(item.id)}
                        >
                          <Icon name="account-switch" size={20} color="white" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* "Leave Team" button */}
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleLeaveTeam}
            >
              <Text style={styles.leaveButtonText}>Leave Team</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.buttoneditlineupContainer}
              onPress={handleEditLineupTeam}
            >
              <Icon name="square-edit-outline" size={24} color="white" />
              <Text style={styles.buttoneditlineupText}>Edit Team Lineup</Text>
            </TouchableOpacity>

            <View style={styles.lineupContainer}>
              <LineupGrid lineup={lineup} />
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  lineupContainer: {
    marginVertical: 10, // Adjust margin as needed
    marginHorizontal: 10, // Adjust margin as needed
    flex: 1,
    justifyContent: "center",
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20, // Adjust as needed
    minHeight: "200%",
  },
  contentContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "100%", // Ensure the header takes full width
  },
  notificationIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10, // Add margin to separate from the edit button
  },
  notificationIcon: {
    paddingHorizontal: 6,
    paddingVertical: -10,
    borderRadius: 10,
    zIndex: 1,
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
    backgroundColor: "#05a759",
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
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -100, // Add margin to separate from the team name
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginVertical: 10,
  },
  lineupItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#222",
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  lineupTextContainer: {
    flex: 1,
    flexDirection: "column",
  },
  lineupItemText: {
    fontSize: 18,
    color: "#05a759",
    fontWeight: "bold",
  },
  lineupItemName: {
    color: COLORS.green,
  },
  positionText: {
    fontSize: 14,
    color: COLORS.white,
  },
  noTeamText: {
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 20,
  },
  orText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#888", // Color of the divider
    marginVertical: 20, // Adjust as needed
  },
  leaveButton: {
    backgroundColor: "#FF0000", // Red color for leave button
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  leaveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  kickButton: {
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  transferButton: {
    backgroundColor: "blue",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  teamMembersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Center vertically
  },
  inviteButton: {
    backgroundColor: COLORS.secondary, // Change to your desired color
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  inviteButtonText: {
    color: COLORS.white,
    marginLeft: 5, // Add space between icon and text
  },
  buttoneditlineupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3, // for Android
    shadowColor: "#000", // for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttoneditlineupText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TeamScreen;
