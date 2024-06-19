import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { AirbnbRating } from "react-native-ratings";
import MapView, { Marker } from "react-native-maps"; // Import MapView from 'react-native-maps'
import axiosInstance from "../utils/axios"; // Adjust path based on your project

const ClubProfileScreen = ({ route, navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowConfirmation, setShowUnfollowConfirmation] =
    useState(false);

  useEffect(() => {
    // Fetch club profile data when component mounts
    fetchClubProfile();
  }, []);

  const fetchClubProfile = async () => {
    try {
      // Replace with actual API endpoint to fetch club profile data
      const response = await axiosInstance.get(
        `/club/profile/${route.params.clubId}`
      );
      console.log("Club Profile Data:", response.data);
      setProfileData(response.data); // Set profile data fetched from API
      // Example: setIsFollowing(response.data.isFollowing); // Set following status
    } catch (error) {
      console.error("Error fetching club profile:", error);
    }
  };

  // Function to handle following/unfollowing club
  const handleFollow = () => {
    // Implement logic to follow the club
    setIsFollowing(true);
  };

  // Function to handle unfollowing club
  const handleUnfollow = () => {
    // Implement logic to unfollow the club
    setIsFollowing(false);
    setShowUnfollowConfirmation(false); // Hide unfollow confirmation modal
  };

  // Function to navigate to profile photos screen
  const navigateToProfilePhotos = (photo) => {
    // Implement navigation logic
  };

  // Function to navigate to followers/following screen
  const navigateToFollowersFollowing = () => {
    // Implement navigation logic
  };

  // Function to navigate to book field screen
  const handleBookField = () => {
    // Implement navigation logic
  };

  // Function to format count numbers (e.g., followers count)
  const formatCount = (count) => {
    // Implement formatting logic if needed
    return count.toString();
  };

  // Function to format opening hours
  const formatOpeningHours = (start, end) => {
    // Implement formatting logic if needed
    return `${start} - ${end}`;
  };

  // Function to render the club profile UI
  const renderClubProfile = () => {
    console.log("Profile Data:", profileData);
    if (!profileData) {
      return null;
    }

    const {
      name,
      pic,
      location,
      description,
      followersCount,
      averageRating,
      workingHoursStart,
      workingHoursEnd,
      utilities,
      lat,
      lon,
    } = profileData;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Return Arrow */}
          <TouchableOpacity
            style={styles.returnArrow}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Icon name="arrow-left" size={24} color="#05a759" />
          </TouchableOpacity>

          {/* Club header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigateToProfilePhotos(pic)}>
              <Image source={{ uri: pic }} style={styles.profilePhoto} />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.name}>{name}</Text>
              {/* Followers, Following, Trophies */}
              <View style={styles.countContainer2}>
                <TouchableOpacity
                  onPress={() => navigateToFollowersFollowing()}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumber}>
                    {formatCount(followersCount)}
                  </Text>
                  <Text style={styles.countLabel}>Followers</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigateToFollowersFollowing()}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumberRating}>{averageRating}</Text>
                  <Text style={styles.countLabelRating}>Rating</Text>
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
              onPress={
                isFollowing
                  ? () => setShowUnfollowConfirmation(true)
                  : handleFollow
              }
            >
              <Text style={styles.buttonText}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>

            {/* Book a Field button */}
            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBookField}
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
            <View style={styles.modal}>
              <Text style={styles.modalText}>
                Are you sure you want to unfollow?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleUnfollow}
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
            <View style={styles.infoItem}>
              <Icon
                name="clock-outline"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Opening Hours:</Text>
                <Text style={styles.infoText}>
                  {formatOpeningHours(workingHoursStart, workingHoursEnd)}
                </Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.infoItem}>
              <Icon
                name="map-marker"
                size={20}
                color="#05a759"
                style={styles.icon}
              />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location:</Text>
                <Text style={styles.infoText}>{location}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Description:</Text>
            <Text style={styles.infoText}>{description}</Text>
          </View>

          {/* Utilities */}
          <View style={styles.utilityContainer}>
            <Text style={styles.utilityTitle}>Utilities</Text>
            <View style={styles.utilityList}>
              {utilities.map((utility, index) => (
                <View key={index} style={styles.utilityItem}>
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
              ))}
            </View>
          </View>

          {/* Location map */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              region={{
                latitude: lat,
                longitude: lon,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {/* Marker for the club's location */}
              <Marker
                coordinate={{ latitude: lat, longitude: lon }}
                title={name}
              />
            </MapView>
          </View>

          {/* Rating */}
          <AirbnbRating
            count={5}
            defaultRating={averageRating}
            size={20}
            showRating={false}
            onFinishRating={(rating) => console.log("Rated:", rating)}
            style={styles.rating}
          />
          <Text style={styles.ratingLabel}>Rating</Text>

          {/* Add any additional sections as needed */}
        </ScrollView>
      </SafeAreaView>
    );
  };

  // Styles
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: "#1a1a1a",
    },
    returnArrow: {
      position: "absolute",
      top: 20,
      left: 20,
      zIndex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#333",
    },
    profilePhoto: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 20,
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
    countContainer2: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    countItem: {
      alignItems: "center",
    },
    countNumber: {
      color: "#fff",
      fontSize: 18,
    },
    countLabel: {
      color: "#888",
    },
    countNumberRating: {
      color: "#fff",
      fontSize: 18,
    },
    countLabelRating: {
      color: "#888",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginVertical: 20,
    },
    button: {
      backgroundColor: "#05a759",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    unfollowButton: {
      backgroundColor: "#d9534f", // Red color for unfollow button
    },
    bookButton: {
      backgroundColor: "#337ab7", // Adjust color as needed
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    modal: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    modalText: {
      fontSize: 18,
      marginBottom: 20,
      textAlign: "center",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#337ab7",
      borderRadius: 5,
      marginHorizontal: 10,
    },
    modalButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    infoContainer: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#333",
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    icon: {
      marginRight: 10,
    },
    infoTextContainer: {
      flex: 1,
    },
    infoLabel: {
      color: "#05a759",
      fontSize: 16,
      marginBottom: 5,
    },
    infoText: {
      color: "#fff",
      fontSize: 16,
    },
    utilityContainer: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#333",
    },
    utilityTitle: {
      color: "#05a759",
      fontSize: 20,
      marginBottom: 10,
    },
    utilityList: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    utilityItem: {
      flexDirection: "row",
      alignItems: "center",
      width: "50%", // Two items per row
      marginBottom: 10,
    },
    utilityIcon: {
      marginRight: 10,
    },
    utilityTextContainer: {
      flex: 1,
    },
    utilityName: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    utilityText: {
      color: "#fff",
      fontSize: 14,
    },
    mapContainer: {
      height: 200,
      backgroundColor: "#333",
      justifyContent: "center",
      alignItems: "center",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    rating: {
      alignSelf: "center",
      marginVertical: 20,
    },
    ratingLabel: {
      color: "#fff",
      fontSize: 16,
      textAlign: "center",
    },
  });

  return renderClubProfile();
};

export default ClubProfileScreen;
