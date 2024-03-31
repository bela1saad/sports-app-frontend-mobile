import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native"; // Import the useNavigation hook

const SearchCards = ({ data }) => {
  const navigation = useNavigation(); // Initialize the navigation object

  const navigateToProfile = (profileType, id) => {
    // Navigate to the ProfileScreen with profileType and id parameters
    navigation.navigate("Profile", { profileType, profileId: id });
  };

  return (
    <View>
      {data.map((item, index) => {
        switch (item.type) {
          case "player":
            return (
              <PlayerCard
                key={index}
                player={item}
                onPress={() => navigateToProfile("player", item.id)}
              />
            );
          case "club":
            return (
              <ClubCard
                key={index}
                club={item}
                onPress={() => navigateToProfile("club", item.id)}
              />
            );
          case "team":
            return (
              <TeamCard
                key={index}
                team={item}
                onPress={() => navigateToProfile("team", item.id)}
              />
            );
          case "tournament":
            return (
              <TournamentCard
                key={index}
                tournament={item}
                onPress={() => navigateToProfile("tournament", item.id)}
              />
            );
          default:
            return null;
        }
      })}
    </View>
  );
};

const PlayerCard = ({ player, onPress }) => {
  const { photo, username, sport, position, city, country, isFriend } = player;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={photo} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.details}>Sport: {sport || "-"}</Text>
        <Text style={styles.details}>Position: {position || "-"}</Text>
        <Text style={styles.details}>
          {city}, {country}
        </Text>
        {isFriend ? (
          <Text style={styles.friend}>Friend</Text>
        ) : (
          <TouchableOpacity style={styles.addFriend}>
            <Text style={styles.addFriendText}>Add Friend</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ClubCard = ({ club, onPress }) => {
  const { photo, name, city, country, sports, rating } = club;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={photo} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>
          {city}, {country}
        </Text>
        <View style={styles.sportsContainer}>
          {/* Map through the sports array and render icons for each sport */}
          {sports.map((sport, index) => (
            <Icon
              key={index}
              name={getSportIcon(sport)}
              style={styles.sportIcon}
            />
          ))}
        </View>
        <Text style={styles.rating}>Rating: {rating}</Text>
      </View>
    </TouchableOpacity>
  );
};

const TeamCard = ({ team, onPress }) => {
  const { photo, name, sport, city, country } = team;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={photo} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>Sport: {sport}</Text>
        <Text style={styles.details}>
          {city}, {country}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const TournamentCard = ({ tournament, onPress }) => {
  const { photo, name, sport, city, country, state } = tournament;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={photo} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>Sport: {sport}</Text>
        <Text style={styles.details}>
          {city}, {country}
        </Text>
        <Text style={styles.state}>{state}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getSportIcon = (sport) => {
  switch (sport) {
    case "Football":
      return "soccer";
    case "Basketball":
      return "basketball";
    case "Tennis":
      return "tennis";
    // Add more sports and their respective icons as needed
    default:
      return "help-circle"; // Default icon if sport not found
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#222", // Dark background color
    borderRadius: 15,
    marginVertical: 5,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff", // Text color
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#aaa", // Text color
    marginBottom: 3,
  },
  sportsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  sportIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
    color: "#05a759", // Icon color
  },
  rating: {
    fontSize: 14,
    color: "#05a759",
    fontWeight: "bold",
  },
  state: {
    fontSize: 14,
    color: "#05a759",
    fontWeight: "bold",
  },
  friend: {
    color: "#05a759",
    fontWeight: "bold",
  },
  addFriend: {
    backgroundColor: "#05a759",
    padding: 5,
    borderRadius: 5,
  },
  addFriendText: {
    color: "#fff", // Text color
  },
});

export default SearchCards;
