import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  RefreshControl,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import COLORS from "../constants/colors";
import Filters from "../components/Filters";
import Post from "../components/Post";
import Ads from "../components/Ads";
import NotificationsIcon from "../components/NotificationsIcon";
import SearchBar from "../components/SearchBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/AuthContext";
import axiosInstance from "../utils/axios";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const notificationCount = 100;
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSport, setSelectedSport] = useState("All");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { currentPlayer } = useAuth(); // Get currentPlayer from AuthContext

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get(`/posts/recommended`);
      setPosts(response.data);
      filterPosts(response.data); // Initial filtering
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts();
    }, [])
  );

  useEffect(() => {
    filterPosts();
  }, [selectedFilter, selectedSport, posts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
    setRefreshing(false);
  };

  const filterPosts = (postsToFilter = posts) => {
    let filtered = postsToFilter;

    // Filter based on selected filter
    if (selectedFilter !== "All") {
      if (selectedFilter === "Team" || selectedFilter === "Player") {
        // Modify filter condition to check if type starts with "need" and ends with selectedFilter
        filtered = filtered.filter(
          (post) =>
            post.type.toLowerCase().startsWith("need") &&
            post.type.toLowerCase().endsWith(selectedFilter.toLowerCase())
        );
      }
    }

    // Filter based on selected sport
    if (selectedSport !== "All") {
      filtered = filtered.filter((post) => {
        // Ensure post.reservation and nested properties are not null
        return post.sport === selectedSport;
      });
    }

    setFilteredPosts(filtered);
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const goToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const renderHeader = () => (
    <>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={goToEditProfile} style={styles.profilePhoto}>
          <Image
            source={
              currentPlayer && currentPlayer.pic
                ? { uri: currentPlayer.pic }
                : require("../assets/profile_photo.png")
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {currentPlayer ? currentPlayer.name : "Loading..."}
          </Text>
          <Text style={styles.profileLocation}>
            {currentPlayer ? currentPlayer.location : ""}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("Sidebar")}
        style={styles.sidebarButton}
      >
        <Text>
          <Icon name="bars" size={width * 0.08} color={COLORS.white} />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Notifications")}
        style={styles.notificationIcon}
      >
        <NotificationsIcon count={notificationCount} size={width * 0.08} />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <SearchBar
          placeholder="Search"
          onChangeText={(text) => console.log(text)}
        />

        <Ads style={styles.adsContainer} />

        <Filters
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
        />
      </View>
    </>
  );

  const renderPost = ({ item }) => <Post key={item.id} post={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.grey1000} />
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey1000,
  },
  flatListContent: {
    padding: width * 0.05,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: width * 0.05,
  },
  profilePhoto: {
    marginRight: width * 0.03,
  },
  profileImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    borderWidth: 2,
    borderColor: COLORS.Green,
  },
  profileInfo: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  profileLocation: {
    fontSize: 14,
    color: COLORS.grey500,
  },
  sidebarButton: {
    position: "absolute",
    top: height * 0.02,
    right: width * 0.08,
    zIndex: 1,
  },
  notificationIcon: {
    position: "absolute",
    top: height * 0.02,
    right: width * 0.21,
    zIndex: 1,
  },
  contentContainer: {
    marginTop: height * 0.05,
    marginBottom: width * 0.05,
  },
  adsContainer: {
    backgroundColor: COLORS.darkBlue,
    padding: width * 0.05,
    borderRadius: width * 0.05,
    marginBottom: width * 0.05,
  },
});

export default HomeScreen;
