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
          isBenched: player.x === null && player.y === null,
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
    const benchPosition = {
      x: 0.5, // Placeholder or default value for x when benched
      y: 0.5, // Placeholder or default value for y when benched
    };

    const updatedPlayer = {
      ...player,
      isBenched: true,
      x: benchPosition.x,
      y: benchPosition.y,
    };

    const updatedLineup = lineup.map((p) =>
      p.id === player.id ? updatedPlayer : p
    );
    setLineup(updatedLineup);

    try {
      await axiosInstance.put(`/lineup/update/${player.id}`, {
        x: benchPosition.x,
        y: benchPosition.y,
        isBenched: true,
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
                    {item.position ? item.position.name : "Unknown Position"}
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
  },
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  fieldContainer: {
    width: "100%",
    alignItems: "center",
  },
  pitchContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 3 / 4,
  },
  pitchBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  benchContainer: {
    width: "100%",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#444",
    alignItems: "center",
  },
  benchTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  benchScroll: {
    flexDirection: "row",
  },
  benchCard: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginRight: 10,
  },
  benchImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
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
});

export default LineupEditScreen;
