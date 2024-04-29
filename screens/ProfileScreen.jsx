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

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LineupGrid from "../components/LineupGrid";
// Import dummy data
import {
  dummyPlayers,
  dummyTeams,
  dummyClubs,
  dummyTournaments,
} from "../Data/dummyData";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import MapView, { Marker } from "react-native-maps";

function convertTo12HourFormat(time24) {
  // Parse the 24-hour time string using Moment.js
  const timeMoment = moment(time24, "HH:mm:ss");

  // Format the time in 12-hour format with AM/PM
  const time12 = timeMoment.format("h:mm:ss A");

  return time12;
}

const ProfileScreen = ({ route }) => {
  const { profileType, profileId } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [isFollower, setIsFollower] = useState(false); // Track if current user is a follower
  const navigation = useNavigation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowConfirmation, setShowUnfollowConfirmation] =
    useState(false);
  const scrollViewRef = useRef(null); // Ref for ScrollView

  useEffect(() => {
    console.log("Profile Type:", profileType);
    console.log("Profile ID:", profileId);

    navigation.setOptions({
      headerShown: false,
    });

    // Fetch profile data based on profileType and profileId
    switch (profileType) {
      case "player":
        console.log("Fetching player data...");
        setProfileData(dummyPlayers.find((player) => player.id === profileId));
        break;
      case "team":
        console.log("Fetching team data...");
        setProfileData(dummyTeams.find((team) => team.id === profileId));
        break;
      case "club":
        console.log("Fetching club data...");
        setProfileData(dummyClubs.find((club) => club.id === profileId));
        break;
      case "tournament":
        console.log("Fetching tournament data...");
        setProfileData(
          dummyTournaments.find((tournament) => tournament.id === profileId)
        );
        break;
      default:
        console.log("Profile type not recognized.");
        setProfileData(null);
    }
  }, [navigation, profileId, profileType]);

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

  const handleFollow = () => {
    setIsFollowing(true);
    // Perform actions to follow the team
  };

  const handleUnfollow = () => {
    setShowUnfollowConfirmation(true);
  };

  const confirmUnfollow = () => {
    setIsFollowing(false);
    setShowUnfollowConfirmation(false);
    // Perform actions to unfollow the team
  };
  const handleInviteToTeam = () => {
    // Implement the logic for inviting to team
    // This could involve showing a modal, navigating to a screen, etc.
    console.log("Invite to team button clicked");
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
              <Image source={profileData.photo} style={styles.profilePhoto} />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.name}>{profileData.username}</Text>
              {/* Followers, Following, Trophies */}
              <View style={styles.countContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigateToFollowersFollowing(profileType, profileId)
                  }
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {formatCount(profileData.followers)}
                  </Text>
                  <Text style={styles.countLabel}>Followers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigateToFollowersFollowing(profileType, profileId)
                  }
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {formatCount(profileData.following)}
                  </Text>
                  <Text style={styles.countLabel}>Following</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={navigateToTrophies}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {profileData.trophies.length}
                  </Text>
                  <Text style={styles.countLabel}>Trophies</Text>
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
              style={styles.inviteButton}
              onPress={handleInviteToTeam}
            >
              <Text style={styles.buttonText}>Invite to Team</Text>
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
          {/* Profile info */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Profile Information</Text>
            <View style={styles.infoItem}>
              <Icon name="cake" size={20} color="#05a759" style={styles.icon} />
              <Text style={styles.infoText}>Age: {profileData.age}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="soccer"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>Team: {profileData.team}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="map-marker"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                Location: {profileData.city}, {profileData.country}
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
                Position: {profileData.position}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="soccer"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>Sport: {profileData.sport}</Text>
            </View>
            {/* Additional info like trophies */}
            <Text style={styles.infoTitle}>Achievements</Text>
            {profileData.trophies.map((trophy, index) => (
              <View key={index} style={styles.infoItem}>
                <Icon
                  name="trophy"
                  size={20}
                  color="#05a759"
                  style={styles.icon}
                />
                <Text style={styles.achievement}>{trophy}</Text>
              </View>
            ))}
          </View>

          {/* Barrier */}
          <View style={styles.barrier} />
          {/* Profile photos */}
          <View style={styles.photosContainer}>
            {profileData.profilePhotos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigateToProfilePhotos(photo)}
                style={styles.photoItem}
              >
                <Image source={photo} style={styles.photo} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  // Render team profile UI
  function renderTeamProfile() {
    console.log("Profile Data:", profileData);
    if (!profileData || !profileData.lineup) {
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
              onPress={() => navigateToProfilePhotos(profileData.photo)}
            >
              <Image source={profileData.photo} style={styles.profilePhoto} />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.name}>{profileData.name}</Text>

              {/* Followers, Following, Trophies */}
              <View style={styles.countContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigateToFollowersFollowing(profileType, profileId)
                  }
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {formatCount(profileData.followers)}
                  </Text>
                  <Text style={styles.countLabel}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigateToFollowersFollowing(profileType, profileId)
                  }
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {formatCount(profileData.following)}
                  </Text>
                  <Text style={styles.countLabel}>Following</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={navigateToTrophies}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {profileData.trophies.length}
                  </Text>
                  <Text style={styles.countLabel}>Trophies</Text>
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
            {/* Invite button */}
            <TouchableOpacity
              style={styles.inviteTeamButton}
              onPress={handleInviteToTeam}
            >
              <Text style={styles.buttonText}>Invite to challenge </Text>
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
          {/* Additional team info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Icon
                name={profileData.up_for_game ? "check-circle" : "close-circle"}
                size={20}
                color={profileData.up_for_game ? "#05a759" : "#e53935"}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.infoText,
                  {
                    color: profileData.up_for_game ? "#05a759" : "#e53935",
                    fontWeight: "bold",
                  },
                ]}
              >
                {profileData.up_for_game ? "Open for a Game" : "Not Available "}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="soccer"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>Sport: {profileData.sport}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon
                name="map-marker"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <Text style={styles.infoText}>
                Location: {profileData.city}, {profileData.country}
              </Text>
            </View>
          </View>
          {/* Description */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Description</Text>
            <Text style={styles.infoText}>{profileData.description}</Text>
          </View>
          {/* Barrier */}
          <View style={styles.barrier} />
          {/*formation*/}
          <View style={styles.lineupGrid}>
            <LineupGrid lineup={profileData.lineup} />
          </View>
          {/* Barrier */}
          <View style={styles.barrier2} />
          {/* Lineup */}
          <View style={styles.lineupContainer}>
            <Text style={styles.lineupTitle}>Lineup</Text>
            {profileData.lineup.map((player, index) => (
              <View key={index} style={styles.playerContainer}>
                <Image source={player.photo} style={styles.playerPhoto} />
                <View style={styles.playerInfo}>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigateToProfile("player", player.id)}
                    >
                      <Text style={styles.playerName}>
                        {player.name}{" "}
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

                    <Text style={styles.playerPosition}>{player.position}</Text>
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

          {/* Barrier */}
          <View style={styles.barrier} />
          {/* Profile photos */}
          <View style={styles.photosContainer}>
            {profileData.profilePhotos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigateToProfilePhotos(photo)}
                style={styles.photoItem}
              >
                <Image source={photo} style={styles.photo} />
              </TouchableOpacity>
            ))}
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
              <Image source={profileData.photo} style={styles.profilePhoto} />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.name}>{profileData.name}</Text>
              {/* Followers, Following, Trophies */}
              <View style={styles.countContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigateToFollowersFollowing(profileType, profileId)
                  }
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {formatCount(profileData.followers)}
                  </Text>
                  <Text style={styles.countLabel}>Followers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={navigateToFields}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>{profileData.fields}</Text>
                  <Text style={styles.countLabel}>Fields</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={navigateToFollowersFollowing}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumberRating}>
                    {" "}
                    {profileData.rating}
                  </Text>

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
            {/* Sports */}
            <View style={styles.infoItemclub}>
              <Icon
                name="soccer"
                size={20}
                color="#05a759"
                style={styles.iconclub}
              />
              <View style={styles.infoTextContainerclub}>
                <Text style={styles.infoLabelclub}>Sports:</Text>
                <Text style={styles.infoTextclub}>
                  {profileData.sports.join(", ")}
                </Text>
              </View>
            </View>

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
                    profileData.openingHours.open,
                    profileData.openingHours.close
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
                <Text style={styles.infoTextclub}>
                  {profileData.city}, {profileData.country}
                </Text>
              </View>
            </View>
          </View>

          {/* Utilities */}
          <View style={styles.utilityContainer}>
            <Text style={styles.utilityTitle}>Utilities</Text>
            <View style={styles.utilityList}>
              {profileData.utilities.map((utility, index) => (
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
                    <Text style={styles.utilityText}>
                      {utility.description}
                    </Text>
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
                latitude: profileData.location.latitude,
                longitude: profileData.location.longitude,
                latitudeDelta: 0.05, // Adjust the delta values as needed
                longitudeDelta: 0.05,
              }} // Set region to club's location
            >
              {/* Add marker for the club location */}
              <Marker
                coordinate={{
                  latitude: profileData.location.latitude,
                  longitude: profileData.location.longitude,
                }}
                title={profileData.name} // Club name as marker title
              />
            </MapView>
          </View>
          {/* Barrier */}
          <View style={styles.barrier} />
          {/* Profile photos */}
          <View style={styles.photosContainer}>
            {profileData.profilePhotos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigateToProfilePhotos(photo)}
                style={styles.photoItem}
              >
                <Image source={photo} style={styles.photo} />
              </TouchableOpacity>
            ))}
          </View>
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
      return (count / 1000).toFixed(0) + "k";
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
    case "wifi":
      return "wifi";
    case "parking":
      return "parking";
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
    marginTop: windowWidth * 0.02, // Adjusted for responsiveness
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
    padding: windowWidth * 0.05,
    borderRadius: 10,
    marginBottom: windowWidth * 0.05,
    marginTop: windowWidth * 0.0012,
  },
  infoTitle: {
    fontSize: Math.min(windowWidth * 0.04 * scaleFactor, maxFontSize * 0.75), // Adjusted font size capped at 75% of maxFontSize
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    paddingStart: windowWidth * 0.01,
    paddingHorizontal: 20,
    marginBottom: windowWidth * 0.02 * scaleFactor, // Adjusted margin based on font size
  },
  infoText: {
    fontSize: Math.min(windowWidth * 0.035 * scaleFactor, maxFontSize * 0.75), // Adjusted font size capped at 75% of maxFontSize
    color: "#fff",
    flex: 1,
    marginBottom: windowWidth * 0.01 * scaleFactor, // Adjusted margin based on font size
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
});

export default ProfileScreen;
