import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import COLORS from "../constants/colors";
import Filters from "../components/Filters";
import Post from "../components/Post";
import Ads from "../components/Ads";
import NotificationsIcon from "../components/NotificationsIcon";
import SearchBar from "../components/SearchBar";
import { dummyPosts } from "../Data/dummyData";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLayoutEffect } from "react";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const notificationCount = 100;
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedSport, setSelectedSport] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    filterPosts();
  }, [selectedFilter, selectedSport]);

  const filterPosts = () => {
    let filtered = dummyPosts;

    // Filter based on selected filter
    if (selectedFilter !== "All") {
      if (selectedFilter === "Team" || selectedFilter === "Player") {
        filtered = filtered.filter(
          (post) => post.type.toLowerCase() === selectedFilter.toLowerCase()
        );
      }
    }

    // Filter based on selected sport
    if (selectedSport !== "All") {
      filtered = filtered.filter((post) => post.sport === selectedSport);
    }

    setFilteredPosts(filtered);
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const goToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.grey1000} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={goToEditProfile} style={styles.profilePhoto}>
          <Image
            source={require("../assets/profile_photo.png")}
            style={styles.profileImage}
          />
        </TouchableOpacity>

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

          {filteredPosts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.grey1000,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: width * 0.05,
  },
  profilePhoto: {
    position: "absolute",
    top: height * 0.02,
    left: width * 0.05,
    zIndex: 1,
  },
  profileImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    borderWidth: 2,
    borderColor: COLORS.Green,
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
    marginTop: height * 0.1,
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
