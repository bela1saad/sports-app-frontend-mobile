import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const FriendsScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Dummy data for friends list
  const [friends, setFriends] = useState([
    {
      id: 1,
      name: "John Doe",
      photo: require("../../assets/user_photo.jpg"),
      unfriended: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      photo: require("../../assets/user_photo.jpg"),
      unfriended: false,
    },
    {
      id: 3,
      name: "David Johnson",
      photo: require("../../assets/user_photo.jpg"),
      unfriended: false,
    },
    {
      id: 4,
      name: "Emily Brown",
      photo: require("../../assets/user_photo.jpg"),
      unfriended: false,
    },
    {
      id: 5,
      name: "Michael Wilson",
      photo: require("../../assets/user_photo.jpg"),
      unfriended: false,
    },
    // Add more dummy data as needed
  ]);

  const goBack = () => {
    navigation.goBack();
  };

  const navigateToProfile = (friend) => {
    // Navigate to the friend's profile screen
    console.log("Navigating to", friend.name, "'s profile");
  };

  const unfriend = (friend) => {
    setFriends((prevFriends) =>
      prevFriends.map((item) =>
        item.id === friend.id ? { ...item, unfriended: true } : item
      )
    );
  };

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onPress={() => navigateToProfile(item)}
    >
      <Image source={item.photo} style={styles.friendPhoto} />
      <Text style={styles.friendName}>{item.name}</Text>
      {!item.unfriended && (
        <TouchableOpacity
          style={styles.unfriendButton}
          onPress={() => unfriend(item)}
        >
          <Text style={styles.unfriendButtonText}>Unfriend</Text>
        </TouchableOpacity>
      )}
      {item.unfriended && (
        <Text style={styles.unfriendDoneText}>Unfriended</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-back" size={24} color="#05a759" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friends</Text>
        <View style={styles.backButton}></View>
      </View>
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.friendList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#05a759",
    fontSize: 24,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
  },
  friendList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  friendPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendName: {
    color: "#ffffff",
    fontSize: 16,
  },
  unfriendButton: {
    backgroundColor: "#05a759",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  unfriendButtonText: {
    color: "#ffffff",
    fontSize: 14,
  },
  unfriendDoneText: {
    color: "#05a759",
    fontSize: 14,
  },
});

export default FriendsScreen;
