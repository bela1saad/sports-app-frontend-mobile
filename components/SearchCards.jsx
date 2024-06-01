import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const SearchCards = ({ data, onPress }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.noResultsText}>No results found</Text>;
  }

  return (
    <View>
      {data.map((item, index) => {
        switch (item.type) {
          case "player":
            return (
              <PlayerCard
                key={index}
                player={item}
                onPress={() => onPress("player", item.id)}
              />
            );
          case "team":
            return (
              <TeamCard
                key={index}
                team={item}
                onPress={() => onPress("team", item.id)}
              />
            );
          case "club":
            return (
              <ClubCard
                key={index}
                club={item}
                onPress={() => onPress("club", item.id)}
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
  const {
    pic,
    name: username,
    location: { city, country },
    sport,
    position,
  } = player;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: pic }} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.details}>Sport: {sport || ""}</Text>
        <Text style={styles.details}>Position: {position || ""}</Text>
        <Text style={styles.details}>
          {city}, {country}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ClubCard = ({ club, onPress }) => {
  const { pic, name, location } = club;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: pic }} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>Location: {location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const TeamCard = ({ team, onPress }) => {
  const { pic, name, location } = team;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: pic }} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>Location: {location}</Text>
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
    paddingHorizontal: 15, // Adjusted paddingHorizontal for better spacing
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
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: "#aaa",
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
    color: "#05a759",
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
    fontSize: 14,
    color: "#05a759",
    fontWeight: "bold",
  },
  addFriend: {
    backgroundColor: "#05a759",
    paddingVertical: 8, // Adjusted paddingVertical for better spacing
    paddingHorizontal: 12, // Adjusted paddingHorizontal for better spacing
    borderRadius: 8,
    width: 100,
    alignItems: "center", // Center aligning the button
    justifyContent: "center", // Center aligning the button
  },
  addFriendText: {
    fontSize: 14,
    color: "#fff",
  },
});

export default SearchCards;
