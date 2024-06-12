import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import axiosInstance from "../utils/axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../constants/colors";

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
          case "tournament":
            return (
              <TournamentCard
                key={index}
                tournament={item}
                onPress={() => onPress("tournament", item.id)}
              />
            );
          default:
            return null;
        }
      })}
    </View>
  );
};

const useSportName = (sportId) => {
  const [sportName, setSportName] = useState("Unknown");

  useEffect(() => {
    const fetchSportData = async () => {
      try {
        const response = await axiosInstance.get(`/sport/by-id/${sportId}`);
        setSportName(response.data.name);
      } catch (error) {
        console.error("Error fetching sport name:", error);
      }
    };

    if (sportId) {
      fetchSportData();
    }
  }, [sportId]);

  return sportName;
};
const usePositionName = (positionId) => {
  const [positionName, setPositionName] = useState("Unknown");

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        const response = await axiosInstance.get(
          `/position/by-id/${positionId}`
        );
        setPositionName(response.data.name);
      } catch (error) {
        console.error("Error fetching position name:", error);
      }
    };

    if (positionId) {
      fetchPositionData();
    }
  }, [positionId]);

  return positionName;
};

const PlayerCard = ({ player, onPress }) => {
  const { pic, name, location, sport_id, position_id, city } = player;
  const sportName = useSportName(sport_id);
  const positionName = usePositionName(position_id);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: pic }} style={styles.playerImage} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.infoContainer}>
          <Icon
            name="soccer"
            size={16}
            color={COLORS.Green}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{sportName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon
            name="adjust"
            size={16}
            color={COLORS.Green}
            style={styles.icon}
          />
          <Text style={styles.position}>{positionName}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Icon
            name="map-marker"
            size={16}
            color={COLORS.Green}
            style={styles.icon}
          />
          <Text style={styles.infoText}>
            {location}, {city}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TeamCard = ({ team, onPress }) => {
  const { pic, name, level, sport_id } = team;
  const sportName = useSportName(sport_id);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: pic }} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.infoContainer}>
          <Icon
            name="soccer"
            size={16}
            color={COLORS.Green}
            style={styles.icon}
          />
          <Text style={styles.infoText}>{sportName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon
            name="star"
            size={16}
            color={COLORS.Green}
            style={styles.icon}
          />
          <Text style={styles.details}> {level}</Text>
        </View>
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

const TournamentCard = ({ tournament, onPress }) => {
  const { pic, name, location, sport_id } = tournament;
  const sportName = useSportName(sport_id);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: pic }} style={styles.photo} />
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>Sport: {sportName}</Text>
        <Text style={styles.details}>Location: {location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#333",
    borderRadius: 15,
    marginVertical: 5,
    paddingHorizontal: 15,
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
    color: "#fff",
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 3,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#2B2B2B",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
    padding: 15,
    alignItems: "center",
    position: "relative",
  },
  availableContainer: {
    position: "absolute",
    top: 5,
    right: 5,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availableText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 5,
  },
  playerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 5,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.white,
  },
  position: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 5,
  },
});

export default SearchCards;
