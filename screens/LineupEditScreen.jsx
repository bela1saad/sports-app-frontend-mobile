import React, {
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import axiosInstance from "../utils/axios";
const { width } = Dimensions.get("window");
const pitchHeight = width * 1.5;

const LineupEditScreen = ({ route, navigation }) => {
  const [members, setMembers] = useState([]);
  const [lineup, setLineup] = useState([]);
  const [loading, setLoading] = useState(true);
  const teamId = route.params.teamId;

  useLayoutEffect(() => {
    console.log("Layout effect triggered");
    navigation.setOptions({
      headerShown: false, // Hide default header
    });
  }, [navigation]);

  useEffect(() => {
    console.log("Fetching data...");
    const fetchData = async () => {
      try {
        const teamMembersResponse = await axiosInstance.get(
          `/team/current-members`
        );
        console.log("Team members:", teamMembersResponse.data);
        setMembers(teamMembersResponse.data);

        const currentLineupResponse = await axiosInstance.get(
          `/lineup/${teamId}`
        );
        console.log("Current lineup:", currentLineupResponse.data.lineup);
        setLineup(currentLineupResponse.data.lineup);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [teamId]);

  const handleDragEnd = useCallback(({ data }) => {
    console.log("Drag ended, updating lineup positions...");
    setLineup(data);
    // Update API call to save new lineup positions
    data.forEach((player) => {
      axiosInstance
        .put(`/lineup/update/${player.id}`, {
          x: player.x,
          y: player.y,
        })
        .catch((error) => console.error("Error updating lineup:", error));
    });
  }, []);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <View style={styles.playerContainer}>
        <Image source={{ uri: item.player?.pic }} style={styles.playerImage} />
        <Text style={styles.playerName}>{item.player?.name}</Text>
      </View>
    );
  };

  const renderPitch = () => {
    return (
      <View style={styles.pitchContainer}>
        {lineup.map((player) => (
          <View
            key={player.id}
            style={[
              styles.playerIcon,
              { left: player.x * width, top: player.y * pitchHeight },
            ]}
          >
            <Image
              source={{ uri: player.player?.pic }}
              style={styles.playerImage}
            />
            {player.isCaptain && <Text style={styles.captainIcon}>C</Text>}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.pitchWrapper}>
        <Image
          source={require("../assets/football_field.jpg")}
          style={styles.pitchBackground}
        />
        {renderPitch()}
      </View>
      <DraggableFlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={handleDragEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  pitchWrapper: {
    width: width,
    height: pitchHeight,
    position: "relative",
    marginVertical: 20,
  },
  pitchBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    position: "absolute",
  },
  pitchContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  playerIcon: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  playerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  playerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
  },
  playerName: {
    marginLeft: 10,
    color: "#000",
  },
  captainIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "red",
    color: "white",
    borderRadius: 10,
    padding: 2,
    fontSize: 10,
  },
});

export default LineupEditScreen;
