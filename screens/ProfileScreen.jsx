import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  PixelRatio,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../auth/AuthContext"; // Import useAuth hook
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LineupGrid from "../components/LineupGrid";
// Import dummy data
import {
  dummyPlayers,
  dummyTeams,
  dummyClubs,
  dummyTournaments,
} from "../Data/dummyData";
import axiosInstance from "../utils/axios";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import MapView, { Marker } from "react-native-maps";
import { AirbnbRating } from "react-native-ratings";

function convertTo12HourFormat(time24) {
  // Parse the 24-hour time string using Moment.js
  const timeMoment = moment(time24, "HH:mm:ss");

  // Format the time in 12-hour format with AM/PM
  const time12 = timeMoment.format("h:mm:ss A");

  return time12;
}

const ProfileScreen = ({ route }) => {
  const { profileType, id } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [isFollower, setIsFollower] = useState(false); // Track if current user is a follower
  const navigation = useNavigation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowConfirmation, setShowUnfollowConfirmation] =
    useState(false);
  const scrollViewRef = useRef(null); // Ref for ScrollView
  const [followersCount, setFollowersCount] = useState(0);
  const [followedPlayersCount, setFollowedPlayersCount] = useState(0);
  const { currentPlayer } = useAuth(); // Destructure currentPlayer from useAuth
  const [sportName, setSportName] = useState("Unknown");
  const [teamName, setTeamName] = useState(null);
  const [lineupData, setLineupData] = useState([]);
  const [isCurrentTeam, setIsCurrentTeam] = useState(false);
  const [utilities, setUtilities] = useState([]);
  const [loadingUtilities, setLoadingUtilities] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);

  const [lastRating, setLastRating] = useState(null); // State to hold last rating data

  useEffect(() => {
    console.log("Profile Type:", profileType);
    console.log("Profile ID:", id);

    navigation.setOptions({
      headerShown: false,
    });

    // Fetch profile data based on profileType and profileId
    const fetchData = async () => {
      try {
        let url;
        switch (profileType) {
          case "player":
            url = `/player/by-id/${id}`;
            break;
          case "team":
            url = `/team/by-team/${id}`;
            break;
          case "club":
            url = `/club/by-id/${id}`;
            break;
          default:
            // Handle invalid profileType
            return;
        }
        const response = await axiosInstance.get(url);
        const data = response.data;
        console.log(data);
        setProfileData(data);

        // Fetch sport name if sport_id exists
        const sportId = data.sport_id || (data.team && data.team.sport_id);
        if (sportId) {
          console.log("Fetching sport data for sport_id:", sportId);
          getSportById(sportId);
        }

        // Fetch lineup data if profile type is team
        if (profileType === "team" && data.team.id) {
          console.log(data.team.id);
          console.log("Fetching lineup data for team_id:", data.team.id);
          const lineupResponse = await axiosInstance.get(
            `/lineup/${data.team.id}`
          );
          const lineupData = lineupResponse.data.lineup;
          console.log("Lineup Data:", lineupData);
          setLineupData(lineupData);
        }
        // If the profile type is player and it has a team id, fetch the team details
        if (profileType === "player" && data.team_id) {
          const teamResponse = await axiosInstance.get(
            `/team/by-team/${data.team_id}`
          );
          const teamData = teamResponse.data;
          console.log("Team Data:", teamData);
          setTeamName(teamData.team.name); // Update to access team name property
        }

        console.log(currentPlayer.team_id);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const fetchFollowersCount = async () => {
      try {
        let url;
        switch (profileType) {
          case "player":
            url = `/follow/followers-count/${id}`;
            break;
          case "team":
            url = `/team-follow/followers-count/${id}`;
            break;
          case "club":
            url = `/club-follow/followers-count/${id}`;
            break;
          default:
            console.error("Invalid profile type");
            return;
        }

        const response = await axiosInstance.get(url);
        setFollowersCount(response.data.followersCount);
      } catch (error) {
        console.error("Error fetching followers count:", error);
      }
    };

    const fetchFollowedPlayersCount = async () => {
      try {
        const response = await axiosInstance.get(`/follow/followed-count`);

        setFollowedPlayersCount(response.data.followedPlayersCount);
      } catch (error) {
        console.error("Error fetching followed players count:", error);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await axiosInstance.get(`/club_rating/${id}`);
        setAverageRating(response.data.average); // Assuming your API response returns averageRating field
        console.log("Average rating:", response.data.averageRating);
      } catch (error) {
        console.error("Error fetching average club rating:", error);
      }
    };

    // Fetch last rating data for the club
    const fetchLastRating = async () => {
      console.log("club id:", id);
      try {
        const response = await axiosInstance.get(
          `/club_rating/current/rate/${id}`
        );
        if (response.data) {
          setLastRating(response.data);
          console.log("Last rating data:", response.data);
          setRating(response.data.rating_value); // Set current rating based on last rating
        }
      } catch (error) {
        console.error("Error fetching last rating:", error);
      }
    };

    const fetchUtilities = async () => {
      try {
        const response = await axiosInstance.get(`/utilities/club/${id}`);
        setUtilities(response.data);
        setLoadingUtilities(false);
      } catch (error) {
        setError("Failed to fetch utilities");
        setLoadingUtilities(false);
      }
    };

    fetchData();
    fetchFollowersCount();
    fetchFollowedPlayersCount();
    fetchUtilities();
    fetchLastRating();
    fetchAverageRating();
  }, [profileType, id]);

  const getSportById = async (sport_id) => {
    try {
      const response = await axiosInstance.get(`/sport/by-id/${sport_id}`);
      const sportData = response.data;
      setSportName(sportData.name); // Assuming 'name' is the key for the sport name
    } catch (error) {
      console.error("Error fetching sport data:", error);
    }
  };

  useEffect(() => {
    // Scroll to the top when profile screen is rendered
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [profileData]); // Trigger scroll to top whenever profileData changes

  // Rest of your component code...
  // Define the formatOpeningHours function outside the component
  const formatOpeningHours = (open = "00:00:00", close = "00:00:00") => {
    // Format opening and closing time using Moment.js
    const openingTime = moment(open, "HH:mm:ss").format("h:mm A");
    const closingTime = moment(close, "HH:mm:ss").format("h:mm A");
    return `${openingTime} - ${closingTime}`;
  };
  const navigateToProfilePhotos = (photoUrl) => {
    // Navigate to the PhotoFullScreen screen with the provided photoUrl
    navigation.navigate("PhotoFullScreen", {
      photoUrl: photoUrl,
    });
  };

  // ProfileScreen.js
  const navigateToFollowersFollowing = (profileType, profileId) => {
    navigation.navigate("FollowersFollowing", {
      profileType,
      userId: profileId,
    });
  };

  const navigateToTeamProfile = (teamId) => {
    navigation.navigate("Profile", { profileType: "team", id: teamId });
  };

  const navigateToRating = () => {
    // Navigate to the FollowingScreen with profile data
    navigation.navigate("Rating", { profileData });
  };
  const navigateToTrophies = () => {
    // Navigate to the TrophiesScreen with profile data
    navigation.navigate("Trophies", { trophies: profileData.trophies });
  };
  const navigateToProfile = (profileType, id) => {
    navigation.navigate("Profile", { profileType, profileId: id });
  };
  const navigateToFields = () => {
    // Navigate to the club fields screen
  };

  const handleFollow = async () => {
    try {
      const response = await axiosInstance.post(`/team-follow/follow`);
      if (![200, 201].includes(response.status)) {
        throw new Error(response.data.message || "An unknown error occurred.");
      }
      // Follow successful, update state
      setIsFollowing(true);
      // Display success message or perform any other necessary actions
    } catch (error) {
      // Handle errors
      console.error("Error following team:", error);
      // Display error message
      alert(
        error.response?.data.message ||
          "An error occurred while following the team. Please try again later."
      );
    }
  };

  const handleUnfollow = () => {
    // Display confirmation modal to confirm unfollowing
    setShowUnfollowConfirmation(true);
  };

  const confirmUnfollow = async () => {
    try {
      const response = await axiosInstance.del(`/team-follow/unfollow`);
      if (![200, 201].includes(response.status)) {
        throw new Error(response.data.message || "An unknown error occurred.");
      }
      // Unfollow successful, update state
      setIsFollowing(false);
      // Close modal or perform any other necessary actions
      setShowUnfollowConfirmation(false);
    } catch (error) {
      // Handle errors
      console.error("Error unfollowing team:", error);
      // Display error message
      alert(
        error.response?.data.message ||
          "An error occurred while unfollowing the team. Please try again later."
      );
    }
  };
  const handleInviteToTeam = async () => {
    try {
      const playerId = profileData.id; // Assuming playerId is available in profileData
      const response = await axiosInstance.post(
        `/request/team/invite/${playerId}`
      );

      if (![200, 201].includes(response.status)) {
        throw new Error(response.data.message || "An unknown error occurred.");
      }

      // Invitation successful, display success message
      const successMessage = response.data.message;
      alert(successMessage);
    } catch (error) {
      // Extract error message from the response if available
      const errorMessage = error.response
        ? error.response.data.message
        : error.message ||
          "An error occurred while sending the invitation. Please try again later.";

      // Log the error message without triggering Expo or console error reporting
      console.log("Error inviting to team:", errorMessage);

      // Display error message in a pop-out
      alert(errorMessage);
    }
  };
  const handleRatingCompleted = async (newRating) => {
    try {
      const response = await axiosInstance.post(`/club_rating/rate`, {
        player_id: currentPlayer.id, // Assuming currentPlayer.id is accessible
        club_id: profileData.id,
        rating_value: newRating.toString(), // Ensure rating_value is a string
      });
      setRating(newRating);
      console.log("Rating submission response:", response.data); // Log the response data
      // You can also display the response data in your UI if needed
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleBookField = () => {
    // Logic to handle booking a field
  };

  if (!profileData) {
    return (
      <View style={[styles.container, { backgroundColor: "#1a1a1a" }]}>
        <Text style={styles.errorText}>Error: Profile not found.</Text>
      </View>
    );
  }

  const isCurrentUser = currentPlayer && currentPlayer.id === profileData.id;

  // Render profile UI based on profileType
  switch (profileType) {
    case "player":
      return renderPlayerProfile();
    case "team":
      return renderTeamProfile();
    case "club":
      return renderClubProfile();
    case "tournament":
      return renderTournamentProfile();
    default:
      return null;
  }

  // Render player profile UI
  function renderPlayerProfile() {
    console.log("Profile Data:", profileData);
    if (!profileData) {
      return null;
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[styles.container]}
          scrollEnabled={true} // Ensure scrolling is enabled
        >
          {/* Return Arrow */}
          <TouchableOpacity
            style={styles.returnArrow}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Increase touch area
          >
            <Icon name="arrow-left" size={24} color="#05a759" />
          </TouchableOpacity>
          {/* Profile header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigateToProfilePhotos(profileData.photo)}
            >
              <Image
                source={{ uri: profileData.pic }}
                style={styles.profilePhoto}
              />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.name}>{profileData.name}</Text>
              {/* Followers, Following, Trophies */}
              <View style={styles.countContainer}>
                <TouchableOpacity
                  onPress={() => navigateToFollowersFollowing(profileType, id)}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {formatCount(followersCount)}
                  </Text>
                  <Text style={styles.countLabel}>Followers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigateToFollowersFollowing(profileType, id)}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {formatCount(followedPlayersCount)}
                  </Text>
                  <Text style={styles.countLabel}>Following</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={navigateToTrophies}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>{profileData.sport_id}</Text>
                  <Text style={styles.countLabel}>Trophies</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Follow and Invite buttons */}
          {profileData.id !== currentPlayer?.id && (
            <View style={styles.buttonRow}>
              {/* Follow/Unfollow button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  isFollowing ? styles.unfollowButton : null,
                ]}
                onPress={isFollowing ? handleUnfollow : handleFollow}
              >
                <Text style={styles.buttonText}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={handleInviteToTeam}
              >
                <Text style={styles.buttonText}>Invite to Team</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Unfollow confirmation modal */}
          <Modal
            visible={showUnfollowConfirmation}
            transparent
            animationType="fade"
            onRequestClose={() => setShowUnfollowConfirmation(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View style={styles.modal}>
                <Text style={styles.modalText}>
                  Are you sure you want to unfollow?
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={confirmUnfollow}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowUnfollowConfirmation(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Profile info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Profile Information</Text>

            <View style={styles.infoItem}>
              <Icon
                name="map-marker"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                {profileData.city}, {profileData.location}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="trophy"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                Position: {profileData.position.key}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="soccer"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>Sport: {sportName}</Text>
            </View>

            {/* Conditionally render team information */}
            {teamName && (
              <TouchableOpacity
                onPress={() => navigateToTeamProfile(profileData.team_id)}
              >
                <View style={styles.infoItemTouchable}>
                  <Icon
                    name="account-group"
                    size={20}
                    color="#05a759"
                    style={styles.icon}
                  />
                  <Text style={styles.infoLabelText}>Team:</Text>
                  <Text style={styles.infoTextTouchable}>{teamName}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Barrier */}
          <View style={styles.barrier} />
          {/* Profile photos */}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render team profile UI
  function renderTeamProfile() {
    console.log("Profile Data:", profileData);
    if (!profileData) {
      // Handle case when profileData is undefined or lineup is missing
      return null;
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
        <ScrollView
          contentContainerStyle={[styles.container]}
          scrollEnabled={true} // Ensure scrolling is enabled
        >
          {/* Return Arrow */}
          <TouchableOpacity
            style={styles.returnArrow}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Increase touch area
          >
            <Icon name="arrow-left" size={24} color="#05a759" />
          </TouchableOpacity>
          {/* Profile header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigateToProfilePhotos(profileData.id)}
            >
              <Image
                source={{ uri: profileData.team.pic }}
                style={styles.profilePhoto}
              />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.name}>{profileData.team.name}</Text>

              {/* Followers, Following, Trophies */}
              <View style={styles.countContainer2}>
                <TouchableOpacity
                  onPress={() => navigateToFollowersFollowing(profileType, id)}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {formatCount(followersCount)}
                  </Text>
                  <Text style={styles.countLabel}>Followers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={navigateToTrophies}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {profileData.team.max_number}
                  </Text>
                  <Text style={styles.countLabel}>Trophies</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Follow and Invite buttons */}
          <View style={styles.buttonRow}>
            {/* Follow/Unfollow button */}
            {/* Conditionally render Follow/Unfollow button */}
            {currentPlayer &&
              profileData &&
              currentPlayer.team_id !== profileData.team.id && (
                <>
                  <TouchableOpacity
                    style={[
                      styles.buttonteamfollow,
                      isFollowing ? styles.unfollowButton : null,
                    ]}
                    onPress={isFollowing ? handleUnfollow : handleFollow}
                  >
                    <Text style={styles.buttonText}>
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Text>
                  </TouchableOpacity>

                  {/* Unfollow confirmation modal */}
                  <Modal
                    visible={showUnfollowConfirmation}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowUnfollowConfirmation(false)}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      <View style={styles.modal}>
                        <Text style={styles.modalText}>
                          Are you sure you want to unfollow?
                        </Text>
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={confirmUnfollow}
                        >
                          <Text style={styles.modalButtonText}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={() => setShowUnfollowConfirmation(false)}
                        >
                          <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </>
              )}
          </View>
          {/* Additional team info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon
                name={
                  profileData.team.up_for_game ? "check-circle" : "close-circle"
                }
                size={20}
                color={profileData.team.up_for_game ? "#05a759" : "#e53935"}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.infoText,
                  {
                    color: profileData.team.up_for_game ? "#05a759" : "#e53935",
                    fontWeight: "bold",
                  },
                ]}
              >
                {profileData.team.up_for_game
                  ? "Open for a Game"
                  : "Not Available "}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="soccer"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>Sport: {sportName}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="map-marker"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>{profileData.team.level}</Text>
            </View>
          </View>
          {/* Description */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Description</Text>
            <Text style={styles.infoText}>{profileData.team.description}</Text>
          </View>
          {/* Lineup */}
          <View style={styles.lineupContainer}>
            <Text style={styles.lineupTitle}>Lineup</Text>
            {lineupData.map((player, index) => (
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
                        {player.player.name}{" "}
                        {player.isCaptain && (
                          <Ionicons
                            name="star"
                            size={24}
                            color="#FFD700"
                            style={styles.captainIcon}
                          />
                        )}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.playerPosition}>
                      {player.player.position.name}
                    </Text>
                  </View>
                  <View style={styles.jerseyNumberContainer}>
                    <Text style={styles.jerseyNumberText}>
                      {player.player.position.key}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* Barrier */}
          <View style={styles.barrier} />
          {/*formation*/}
          <View style={styles.lineupGrid}>
            <LineupGrid lineup={lineupData} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render club profile UI
  function renderClubProfile() {
    console.log("Profile Data:", profileData);
    if (!profileData) {
      return null;
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[styles.container]}
          scrollEnabled={true} // Ensure scrolling is enabled
        >
          {/* Return Arrow */}
          <TouchableOpacity
            style={styles.returnArrow}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} // Increase touch area
          >
            <Icon name="arrow-left" size={24} color="#05a759" />
          </TouchableOpacity>
          {/* Club header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigateToProfilePhotos(profileData.photo)}
            >
              <Image
                source={{ uri: profileData.pic }}
                style={styles.profilePhoto}
              />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.name}>{profileData.name}</Text>
              {/* Followers, Following, Trophies */}
              <View style={styles.countContainer2}>
                <TouchableOpacity
                  onPress={() =>
                    navigateToFollowersFollowing(profileType, profileId)
                  }
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>{formatCount(10)}</Text>
                  <Text style={styles.countLabel}>Followers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={navigateToFollowersFollowing}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumberRating}> {averageRating}</Text>

                  <Text style={styles.countLabelRating}>Rating </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Follow and Invite buttons */}
          <View style={styles.buttonRow}>
            {/* Follow/Unfollow button */}
            <TouchableOpacity
              style={[
                styles.button,
                isFollowing ? styles.unfollowButton : null,
              ]}
              onPress={isFollowing ? handleUnfollow : handleFollow}
            >
              <Text style={styles.buttonText}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.BookButton}
              nPress={handleBookField}
            >
              <Text style={styles.buttonText}>Book a Field</Text>
            </TouchableOpacity>
          </View>

          {/* Unfollow confirmation modal */}
          <Modal
            visible={showUnfollowConfirmation}
            transparent
            animationType="fade"
            onRequestClose={() => setShowUnfollowConfirmation(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View style={styles.modal}>
                <Text style={styles.modalText}>
                  Are you sure you want to unfollow?
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={confirmUnfollow}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowUnfollowConfirmation(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Club information */}
          <View style={styles.infoContainer}>
            {/* Opening Hours */}
            <View style={styles.infoItemclub}>
              <Icon
                name="clock-outline"
                size={20}
                color="#05a759"
                style={styles.iconclub}
              />
              <View style={styles.infoTextContainerclub}>
                <Text style={styles.infoLabelclub}>Opening Hours:</Text>
                <Text style={styles.infoTextclub}>
                  {formatOpeningHours(
                    profileData.workingHoursStart,
                    profileData.workingHoursEnd
                  )}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.infoItemclub}>
              <Icon
                name="map-marker"
                size={20}
                color="#05a759"
                style={styles.iconclub}
              />
              <View style={styles.infoTextContainerclub}>
                <Text style={styles.infoLabelclub}>Location:</Text>
                <Text style={styles.infoTextclub}>{profileData.location}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Description :</Text>
            <Text style={styles.infoText}>{profileData.description}</Text>
          </View>

          {/* Utilities */}
          <View style={styles.utilityContainer}>
            <Text style={styles.utilityTitle}>Utilities</Text>
            <View style={styles.utilityList}>
              {utilities.map((utility, index) => (
                <View
                  key={index}
                  style={index % 2 === 0 ? styles.utilityColumn : null}
                >
                  <View style={styles.utilityItem}>
                    <Icon
                      name={getIconNameForUtility(utility.name)}
                      size={20}
                      color="#05a759"
                      style={styles.utilityIcon}
                    />
                    <View style={styles.utilityTextContainer}>
                      <Text style={styles.utilityName}>{utility.name}</Text>
                      <Text style={styles.utilityText}>
                        {utility.description}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Barrier */}
          <View style={styles.barrier} />
          {/* Location map */}
          {/* Location */}
          <View style={styles.infoItemclub}>
            <View style={styles.infoTextContainerclub}>
              <Text style={styles.infoLabelclub}>Location:</Text>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: profileData.lat,
                longitude: profileData.lon,
                latitudeDelta: 0.05, // Adjust the delta values as needed
                longitudeDelta: 0.05,
              }} // Set region to club's location
            >
              {/* Add marker for the club location */}
              <Marker
                coordinate={{
                  latitude: profileData.lat,
                  longitude: profileData.lon,
                }}
                title={profileData.name} // Club name as marker title
              />
            </MapView>
          </View>
          {/* Barrier */}
          <View style={styles.barrier} />
          <AirbnbRating
            count={5}
            defaultRating={rating}
            size={20}
            showRating={false}
            onFinishRating={handleRatingCompleted}
            style={styles.rating}
          />
          <Text style={styles.ratingLabel}>Rating</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Render tournament profile UI
  function renderTournamentProfile() {
    return <View>{/* Tournament profile UI */}</View>;
  }

  // Format the count to display as "1k" for 1000 and "1M" for 1,000,000
  function formatCount(count) {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    } else {
      return count.toString();
    }
  }
};
const getIconNameForUtility = (utilityName) => {
  if (typeof utilityName !== "string") {
    return "information-outline"; // Default icon if utilityName is not a string
  }

  const utility = utilityName.toLowerCase();
  switch (utility) {
    case "parking":
      return "parking";
    case "wi-fi":
      return "wifi";
    case "hot tub":
      return "hot-tub";
    case "gym":
      return "dumbbell";
    case "swimming pool":
      return "pool";
    case "restaurant":
      return "silverware";
    default:
      return "information-outline"; // Default icon
  }
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const { width, height } = Dimensions.get("window");
const SPACING = windowWidth * 0.1; // Adjusted for responsiveness
const scaleFactor = 1; // Base scale factor for font sizes

const maxFontSize = 19; // Maximum font size for text
// Calculate responsive font size
const responsiveFontSize = (fontSize) => {
  const { width, height } = Dimensions.get("window");
  const scale = Math.min(width, height) / 360; // You can adjust the base width (360) as needed
  const ratio = fontSize / 10;
  const newSize = Math.round(PixelRatio.roundToNearestPixel(scale * ratio));
  return newSize;
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: windowWidth * 0.05,
    paddingTop: Platform.OS === "ios" ? 5 : 0, // Adjust for iOS status bar
    paddingBottom: windowWidth * 0.05, // Add padding bottom here
    backgroundColor: "#1a1a1a",
  },
  infoItem: {
    flexDirection: "row", // Display icon and text on the same line
    alignItems: "center", // Align items vertically in the center
    marginBottom: windowWidth * 0.01, // Adjusted for responsiveness
  },
  icon: {
    marginRight: windowWidth * 0.02, // Adjusted for responsiveness
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: windowWidth * 0.05,
  },
  returnArrow: {
    position: "absolute",
    top: Platform.OS === "ios" ? windowWidth * 0.001 : windowWidth * 0.04, // Adjusted top value for iOS
    left: windowWidth * 0.05,
    width: windowWidth * 0.1,
    height: windowWidth * 0.1,
    zIndex: 1,
    marginBottom: windowWidth * 0.02, // Adjusted for responsiveness
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end", // Align items to the end of the container (right)
    marginTop: windowWidth * 0.02,
    marginBottom: windowHeight * 0.03,
    marginHorizontal: windowHeight * 0.01,
  },
  profilePhoto: {
    width: windowWidth * 0.2,
    height: windowWidth * 0.2,
    marginBottom: windowHeight * 0.01,
    marginTop: Platform.OS === "ios" ? height * 0.15 : SPACING,
    marginTop: Platform.OS === "android" ? height * 0.09 : SPACING,
    borderRadius: windowWidth * 0.1,
    borderRadius: windowWidth * 0.1,
    marginRight: windowWidth * 0.05,
  },
  headerText: {
    flex: 1,
    marginTop: windowHeight * 0.03,
  },
  name: {
    fontSize: Math.min(windowWidth * 0.06, maxFontSize), // Adjusted font size capped at maxFontSize
    fontWeight: "bold",
    color: "#05a759",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
    top: 12,
    marginTop: windowHeight * 0.003,
    marginBottom: windowHeight * 0.01,
  },

  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: windowWidth * 0.01,
    marginTop: windowWidth * 0.05,
  },
  countContainer2: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: windowWidth * 0.01,
    marginTop: windowWidth * 0.05,
  },

  countTeamContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: windowWidth * 0.01,
    marginTop: windowWidth * 0.05,
  },
  countItem: {
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  countNumber: {
    fontSize: Math.min(windowWidth * 0.06, maxFontSize),
    fontWeight: "bold",
    color: "#fff",
  },
  countLabel: {
    fontSize: Math.min(windowWidth * 0.03 * scaleFactor, maxFontSize * 0.5),
    color: "#ccc",
    flexShrink: 1,
  },
  countNumberRating: {
    fontSize: Math.min(windowWidth * 0.06, maxFontSize),
    fontWeight: "bold",
    color: "#FFD700",
  },
  countLabelRating: {
    fontSize: Math.min(windowWidth * 0.03 * scaleFactor, maxFontSize * 0.5),
    color: "#FFD700",
    flexShrink: 1,
  },
  infoContainer: {
    backgroundColor: "#333",
    padding: windowWidth * 0.07, // Increase padding for a bigger container
    borderRadius: 10,
    marginBottom: windowWidth * 0.07, // Increase margin bottom
    marginTop: windowWidth * 0.0012,
  },

  infoTitle: {
    fontSize: Math.min(windowWidth * 0.05 * scaleFactor, maxFontSize * 0.75), // Increase font size
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    paddingStart: windowWidth * 0.01,
    paddingHorizontal: 20,
    marginBottom: windowWidth * 0.02 * scaleFactor, // Adjusted margin based on font size
  },
  infoText: {
    fontSize: Math.min(windowWidth * 0.045 * scaleFactor, maxFontSize * 0.75), // Increase font size
    color: "#fff",
    flex: 1,
    marginBottom: windowWidth * 0.015 * scaleFactor, // Adjusted margin based on font size
  },

  barrier: {
    height: 1,
    backgroundColor: "#666",
    marginBottom: 20, // Add margin bottom to provide space for other elements below
    marginTop: 20,
  },
  barrier2: {
    height: 1,
    backgroundColor: "#666",
    marginBottom: windowHeight * -0.09, // Add margin bottom to provide space for other elements below
    marginTop: windowHeight * 0.28,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: windowHeight * 0.08,
  },
  photoItem: {
    width: "32%",
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#333",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  button: {
    paddingVertical: windowWidth * 0.03,
    paddingHorizontal: windowWidth * 0.11,
    borderRadius: 5,
    backgroundColor: "#05a759",
    alignItems: "center",
    marginRight: windowWidth * 0.02,
  },
  buttonText: {
    fontSize: Math.min(windowWidth * 0.04, maxFontSize), // Adjusted font size capped at maxFontSize
    color: "#fff",
    fontWeight: "bold",
  },
  inviteButton: {
    paddingVertical: windowWidth * 0.03,
    paddingHorizontal: windowWidth * 0.06,
    borderRadius: 5,
    backgroundColor: "#05a759",
    alignItems: "center",
    marginRight: windowWidth * 0.02,
  },
  BookButton: {
    paddingVertical: windowWidth * 0.03,
    paddingHorizontal: windowWidth * 0.09,
    borderRadius: 5,
    backgroundColor: "#05a759",
    alignItems: "center",
    marginRight: windowWidth * 0.02,
  },
  inviteTeamButton: {
    flex: 1,
    paddingVertical: "1%",
    paddingHorizontal: "1%",
    borderRadius: 5,
    backgroundColor: "#05a759",
    alignItems: "center",
    marginRight: "2%",
  },
  inviteButtonText: {
    fontSize: "4%", // Adjusted font size as a percentage
    color: "#fff",
    fontWeight: "bold",
  },
  modal: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#05a759",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  lineupContainer: {
    marginVertical: windowWidth * 0.31, // Adjust the vertical margin as needed
    marginBottom: 20,
  },

  lineupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  lineup: {
    alignItems: "center",

    marginBottom: 10,
  },
  lineupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: windowHeight * 0.01, // Add margin bottom to provide space for other elements below
    paddingHorizontal: 10, // Add horizontal padding to adjust spacing
    alignItems: "center", // Center items vertically
  },

  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  playerPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  playerInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 8,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  playerPosition: {
    fontSize: 16,
    color: "#05a759",
  },
  jerseyNumberContainer: {
    backgroundColor: "#05a759",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  jerseyNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  captainIcon: {
    marginRight: 8,
  },

  infoTitleclub: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#05a759",
    marginBottom: 15,
  },
  infoItemclub: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  iconclub: {
    marginRight: 15,
  },
  infoTextContainerclub: {
    flex: 1,
    marginLeft: 5,
  },
  infoLabelclub: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  infoTextclub: {
    fontSize: 16,
    color: "#BDBDBD",
  },

  utilityList: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap", // Allow items to wrap to the next line
  },
  utilityTextContainer: {
    marginLeft: 5,
    marginBottom: "3%", // Responsive margin bottom
  },
  utilityColumn: {
    width: "48%", // Adjust as needed to fit two columns
    marginBottom: "3%", // Adjust as needed for spacing between items
  },
  utilityContainer: {
    marginTop: "5%", // Responsive margin top
  },
  utilityTitle: {
    fontSize: 20, // Adjust as needed
    fontWeight: "bold",
    color: "#05a759",
    marginBottom: "2%", // Responsive margin bottom
  },
  utilityList: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap", // Allow items to wrap to the next line
  },
  utilityColumn: {
    width: "48%", // Adjust as needed to fit two columns
    marginBottom: "2%", // Adjust as needed for spacing between columns
  },
  utilityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "2%", // Responsive margin bottom
  },
  utilityIcon: {
    marginRight: "3%", // Responsive margin right
    marginTop: "1%", // Responsive margin top
  },
  utilityName: {
    fontSize: 16,
    fontWeight: "bold",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap", // Allow items to wrap to the next line
    color: "white", // Adjust as needed
  },
  utilityText: {
    fontSize: 16, // Adjust as needed
    color: "#555",
  },
  openingHoursContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    marginRight: 20,
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#05a759",
  },
  daySchedule: {
    fontSize: 16,
    color: "white",
  },
  mapContainer: {
    height: 300, // Adjust the height as needed
    marginVertical: 30,
    borderRadius: 10,
    overflow: "hidden", // Ensure the map stays within the container
  },
  map: {
    flex: 1, // Ensure the map takes up all available space
  },
  infoItemTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: windowWidth * 0.01,
  },
  icon: {
    marginRight: windowWidth * 0.02,
  },
  infoTextTouchable: {
    fontSize: Math.min(windowWidth * 0.035 * scaleFactor, maxFontSize * 0.75),
    color: "#05a759", // Change the color to your link color
    textDecorationLine: "underline", // Underline the text
    flex: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  infoLabelText: {
    color: "#fff",
    marginRight: 5, // Adjust as needed for spacing between "Team:" and the team name
  },
  buttonteamfollow: {
    paddingVertical: windowWidth * 0.03,
    paddingHorizontal: windowWidth * 0.11,
    borderRadius: 5,
    backgroundColor: "#05a759",
    alignItems: "center",
  },
  rating: {
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 16,
    color: "#05a759",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
