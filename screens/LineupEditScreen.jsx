import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axiosInstance from "../utils/axios";
import DraggablePlayer from "../components/DraggablePlayer";

const { width } = Dimensions.get("window");
const pitchHeight = width * 1.5;
const fieldWidth = width - 40;

const LineupEditScreen = ({ route, navigation }) => {
  const [lineup, setLineup] = useState([]);
  const [loading, setLoading] = useState(true);
  const teamId = route.params.teamId;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    const fetchLineup = async () => {
      try {
        const response = await axiosInstance.get(`/lineup/${teamId}`);
        const fetchedLineup = response.data.lineup.map((player) => ({
          ...player,
          isBenched: player.isBenched, // Ensure this field is used correctly
        }));
        setLineup(fetchedLineup);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lineup:", error);
        setLoading(false);
      }
    };
    fetchLineup();
  }, [teamId]);

  const saveLineupPositions = useCallback(async () => {
    try {
      console.log("Lineup positions saved:", lineup);
    } catch (error) {
      console.error("Error saving lineup positions:", error);
    }
  }, [lineup]);

  useFocusEffect(
    useCallback(() => {
      const fetchLineupPositions = async () => {
        try {
          console.log("Fetching lineup positions...");
        } catch (error) {
          console.error("Error fetching lineup positions:", error);
        }
      };

      fetchLineupPositions();

      return saveLineupPositions;
    }, [saveLineupPositions])
  );

  const handleDragEnd = async (player, x, y, normalizedX, normalizedY) => {
    const benchThreshold = pitchHeight - 100;
    const isOnBench = y > benchThreshold;

    console.log(
      `handleDragEnd: Player ${player.id} - normalizedX: ${normalizedX}, normalizedY: ${normalizedY}, isOnBench: ${isOnBench}`
    );

    const updatedPlayer = {
      ...player,
      isBenched: isOnBench,
      x: isOnBench ? player.x : normalizedX,
      y: isOnBench ? player.y : normalizedY,
    };

    const updatedLineup = lineup.map((p) =>
      p.id === player.id ? updatedPlayer : p
    );
    setLineup(updatedLineup);

    try {
      await axiosInstance.put(`/lineup/update/${player.id}`, {
        x: updatedPlayer.x,
        y: updatedPlayer.y,
        isBenched: updatedPlayer.isBenched,
      });

      console.log(
        `Player ${player.id} updated. isBenched: ${updatedPlayer.isBenched}`
      );
    } catch (error) {
      console.error(
        "Error updating lineup:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleBenchPress = async (player) => {
    const updatedPlayer = {
      ...player,
      isBenched: !player.isBenched, // Toggle bench status
    };

    const updatedLineup = lineup.map((p) =>
      p.id === player.id ? updatedPlayer : p
    );
    setLineup(updatedLineup);

    try {
      await axiosInstance.put(`/lineup/update/${player.id}`, {
        x: updatedPlayer.x,
        y: updatedPlayer.y,
        isBenched: updatedPlayer.isBenched,
      });

      console.log(
        `Player ${player.id} updated. isBenched: ${updatedPlayer.isBenched}`
      );
    } catch (error) {
      console.error("Error updating lineup:", error);
    }
  };
  const renderField = () => {
    const onFieldPlayers = lineup.filter((player) => !player.isBenched);
    const benchPlayers = lineup.filter((player) => player.isBenched);

    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.fieldContainer}>
          <View style={styles.pitchContainer}>
            <Image
              source={require("../assets/football_field.jpg")}
              style={styles.pitchBackground}
            />
            {onFieldPlayers.map((player) => (
              <DraggablePlayer
                key={player.id}
                player={player}
                width={fieldWidth}
                pitchHeight={pitchHeight}
                onDragEnd={handleDragEnd}
                style={styles.playerCard}
              />
            ))}
          </View>
        </View>
        <View style={styles.benchContainer}>
          <Text style={styles.benchTitle}>Bench</Text>
          <FlatList
            horizontal
            data={benchPlayers}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleBenchPress(item)}>
                <View style={styles.benchCard}>
                  <Image
                    source={{ uri: item.player.pic }}
                    style={styles.benchImage}
                  />
                  <Text style={styles.benchName}>
                    {item.player ? item.player.name : "Unnamed"}
                  </Text>
                  <Text style={styles.benchPosition}>
                    {item.player.position.key
                      ? item.player.position.key
                      : "Unknown Position"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.benchScroll}
          />
        </View>
      </ScrollView>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return <SafeAreaView style={styles.container}>{renderField()}</SafeAreaView>;
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    backgroundColor: "#101010",
  },
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  fieldContainer: {
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  pitchContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  pitchBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  benchContainer: {
    width: "100%",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#444",
    alignItems: "center",
    backgroundColor: "#222",
  },
  benchTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  benchScroll: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  benchCard: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  benchImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  benchName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  benchPosition: {
    color: "#aaa",
    fontSize: 12,
  },
  playerCard: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#555",
    borderWidth: 1,
    borderColor: "#aaa",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
});

export default LineupEditScreen;
