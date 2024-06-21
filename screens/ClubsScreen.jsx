import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axiosInstance from "../utils/axios";

const ClubsScreen = () => {
  const navigation = useNavigation();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      console.log("Fetching clubs...");

      const response = await axiosInstance.get("/club/all");
      console.log("Clubs fetched:", response.data);

      const clubsWithRatings = await Promise.all(
        response.data.map(async (club) => {
          try {
            console.log("Fetching rating for club:", club.id);

            const ratingResponse = await axiosInstance.get(
              `/club_rating/${club.id}`
            );
            console.log(
              "Rating fetched for club",
              club.id,
              ":",
              ratingResponse.data
            );

            const averageRating = parseFloat(ratingResponse.data.average) || 0;

            const location = "Madrid, Spain"; // Replace with actual location data

            return { ...club, rating: averageRating, location };
          } catch (error) {
            console.error(`Error fetching rating for club ${club.id}:`, error);
            return {
              ...club,
              rating: 0,
              location: "Unknown location",
            };
          }
        })
      );

      console.log("Clubs with ratings:", clubsWithRatings);
      setClubs(clubsWithRatings);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchClubs();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchClubs();
  };

  const renderClub = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ClubProfileScreen", { clubId: item.id })
      }
    >
      <Image source={{ uri: item.pic }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.ratingText}>Rating:</Text>
          <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStars = (rating) => {
    const stars = [];
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <Icon key={`filled-${i}`} name="star" size={16} color="#FFD700" />
      );
    }

    if (halfStar) {
      stars.push(
        <Icon key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star-o" size={16} color="#FFD700" />
      );
    }

    return stars;
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#05a759" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clubs</Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search clubs..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredClubs}
        renderItem={renderClub}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        key={(
          search + (filteredClubs.length ? filteredClubs[0].id : "")
        ).toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#101010",
  },
  header: {
    backgroundColor: "#05a759",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  searchBar: {
    height: 40,
    borderColor: "#05a759",
    borderWidth: 1,
    borderRadius: 20,
    margin: 10,
    paddingLeft: 15,
    color: "#fff",
  },
  list: {
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#101010",
  },
  card: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    margin: 8,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#05a759",
  },
  location: {
    fontSize: 14,
    color: "#d3d3d3",
    marginTop: 2,
    marginBottom: 5,
  },
  description: {
    marginTop: 5,
    color: "#d3d3d3",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  ratingText: {
    fontSize: 14,
    color: "#d3d3d3",
    marginRight: 5,
  },
  starsContainer: {
    flexDirection: "row",
  },
});

export default ClubsScreen;
