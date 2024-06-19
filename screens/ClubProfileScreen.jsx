import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MapView, { Marker } from "react-native-maps";
import axiosInstance from "../utils/axios";
import { useAuth } from "../auth/AuthContext";
import { AirbnbRating } from "react-native-ratings";
import { Rating } from "react-native-ratings";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from

const ClubProfileScreen = ({ route, navigation }) => {
  const { clubId } = route.params;
  const { currentPlayer } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showUnfollowConfirmation, setShowUnfollowConfirmation] =
    useState(false);
  const [utilities, setUtilities] = useState([]);
  const [loadingUtilities, setLoadingUtilities] = useState(false);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [averageRating, setAverageRating] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      fetchClubProfile();
      checkIsFollowing();
      fetchUtilities();
      fetchLastRating();
      fetchAverageRating();
    }, [clubId])
  );

  const fetchClubProfile = async () => {
    try {
      const profileResponse = await axiosInstance.get(`/club/by-id/${clubId}`);
      if (profileResponse.data) {
        const profile = profileResponse.data;
        const followersCountResponse = await axiosInstance.get(
          `/club-follow/followers-count/${clubId}`
        );
        const followersCount = followersCountResponse.data.followersCount;
        setProfileData({ ...profile, followersCount });
        console.log("followersCount:", followersCount);
      } else {
        console.error("Empty profile data received");
      }
    } catch (error) {
      console.error("Error fetching club profile:", error);
    }
  };

  useEffect(() => {
    console.log("Average rating updated:", averageRating);
  }, [averageRating]);

  const fetchAverageRating = async () => {
    try {
      const response = await axiosInstance.get(`/club_rating/${clubId}`);
      setAverageRating(response.data.average);
      console.log("Average rating fetched:", response.data.average);
    } catch (error) {
      console.error("Error fetching average club rating:", error);
    }
  };

  const fetchLastRating = async () => {
    console.log("club id:", clubId);
    try {
      const response = await axiosInstance.get(
        `/club_rating/current/rate/${clubId}`
      );
      if (response.data) {
        console.log("Last rating data:", response.data);
        setRating(response.data.rating_value);
      }
    } catch (error) {
      console.error("Error fetching last rating:", error);
    }
  };

  const fetchUtilities = async () => {
    setLoadingUtilities(true);
    try {
      const response = await axiosInstance.get(`/utilities/club/${clubId}`);
      setUtilities(response.data);
      setLoadingUtilities(false);
    } catch (error) {
      setError("Failed to fetch utilities");
      setLoadingUtilities(false);
    }
  };

  const checkIsFollowing = async () => {
    try {
      const response = await axiosInstance.get(
        `/club-follow/isFollowed/${clubId}`
      );
      if (response.data && typeof response.data.isFollowing === "boolean") {
        setIsFollowing(response.data.isFollowing);
      } else {
        console.error("Unexpected response structure:", response.data);
      }
      console.log("checkIsFollowing:", response.data.isFollowing); // Debug log
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const body = { playerId: currentPlayer.id, clubId };
      await axiosInstance.post(`/club-follow/follow`, body);
      setIsFollowing(true);
      console.log("handleFollow: true"); // Debug log
    } catch (error) {
      console.error("Error following club:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const body = { playerId: currentPlayer.id, clubId };
      await axiosInstance.delete(`/club-follow/unfollow`, { data: body });
      setIsFollowing(false);
      setShowUnfollowConfirmation(false);
      console.log("handleUnfollow: false"); // Debug log
    } catch (error) {
      console.error("Error unfollowing club:", error);
    }
  };

  const handleRatingCompleted = async (newRating) => {
    try {
      if (!currentPlayer || !currentPlayer.id) {
        console.error("Current player ID is undefined or null");
        return;
      }

      const response = await axiosInstance.post(`/club_rating/rate`, {
        player_id: currentPlayer.id,
        club_id: clubId,
        rating_value: newRating.toString(), // Ensure rating_value is a string
      });

      setRating(newRating);
      console.log("Rating submission response:", response.data);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleBookField = () => {
    navigation.navigate("FieldsScreen", { profileData });
  };

  const navigateToProfilePhotos = (photo) => {
    // Implement navigation logic
  };

  const navigateToFollowersFollowing = () => {
    // Implement navigation logic
  };

  const renderClubProfile = () => {
    if (!profileData) {
      return null;
    }

    const {
      name,
      pic,
      lat,
      lon,
      location,
      workingHoursStart,
      workingHoursEnd,
      description,
      followersCount,
      id,
    } = profileData;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#1a1a1a" }}>
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            style={styles.returnArrow}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Icon name="arrow-left" size={24} color="#05a759" />
          </TouchableOpacity>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigateToProfilePhotos(pic)}>
              <Image source={{ uri: pic }} style={styles.profilePhoto} />
            </TouchableOpacity>

            <View style={styles.headerText}>
              <Text style={styles.name}>{name}</Text>
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
                  onPress={() => {
                    navigateToFollowersFollowing();
                    console.log("Current average rating:", averageRating);
                  }}
                  style={styles.countItem}
                >
                  <Text style={styles.countNumberRating}>{averageRating}</Text>

                  <Text style={styles.countLabelRating}>Rating</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.button,
                isFollowing ? styles.unfollowButton : null,
              ]}
              onPress={() =>
                isFollowing ? setShowUnfollowConfirmation(true) : handleFollow()
              }
            >
              <Text style={styles.buttonText}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBookField}
            >
              <Text style={styles.buttonText}>Book a Field</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={showUnfollowConfirmation}
            transparent
            animationType="fade"
            onRequestClose={() => setShowUnfollowConfirmation(false)}
          >
            <View style={styles.modalContainer}>
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
                  {`${workingHoursStart} - ${workingHoursEnd}`}
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
          {loadingUtilities ? (
            <Text style={styles.loadingText}>Loading utilities...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <View style={styles.utilityContainer}>
              <Text style={styles.utilityTitle}>Utilities:</Text>
              {utilities.length === 0 ? (
                <Text style={styles.utilityText}>No utilities available.</Text>
              ) : (
                utilities.map((utility, index) => (
                  <View key={index} style={styles.utilityItem}>
                    <Icon
                      name="checkbox-marked-circle-outline"
                      size={20}
                      color="#05a759"
                      style={styles.utilityIcon}
                    />
                    <Text style={styles.utilityText}>{utility.name}</Text>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Map */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(lat),
                  longitude: parseFloat(lon),
                }}
              />
            </MapView>
          </View>
          {/* Barrier */}
          <View style={styles.ratingContainer}>
            <AirbnbRating
              count={5}
              defaultRating={rating}
              size={20}
              showRating={false}
              onFinishRating={handleRatingCompleted}
              style={styles.rating}
            />
            <Text style={styles.ratingLabel}>Rating</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  return renderClubProfile();
};

function formatCount(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  } else {
    return count.toString();
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#1a1a1a",
  },
  returnArrow: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#05a759",
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  countContainer2: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  countItem: {
    alignItems: "center",
    marginRight: 16,
  },
  countNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  countLabel: {
    fontSize: 14,
    color: "#aaa",
  },
  countNumberRating: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffd700", // Gold color using hex code
  },

  countLabelRating: {
    fontSize: 14,
    color: "#ffd700",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    backgroundColor: "#05a759",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  unfollowButton: {
    backgroundColor: "#b30000",
  },
  bookButton: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    backgroundColor: "#05a759",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    backgroundColor: "#05a759",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#aaa",
  },
  infoText: {
    fontSize: 16,
    color: "#fff",
  },
  loadingText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4d4d",
    textAlign: "center",
    marginVertical: 20,
  },
  utilityContainer: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  utilityTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  utilityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  utilityIcon: {
    marginRight: 10,
  },
  utilityText: {
    fontSize: 16,
    color: "#fff",
  },
  mapContainer: {
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#2a2a2a",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  ratingContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  barrier: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 10,
  },
  rating: {
    marginVertical: 10,
  },
  ratingLabel: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#05a759",
  },
});

export default ClubProfileScreen;
