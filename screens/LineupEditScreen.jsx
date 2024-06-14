import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axiosInstance from "../utils/axios";
import DraggablePlayer from "../components/DraggablePlayer";

const { width } = Dimensions.get("window");
const pitchHeight = width * 1.5;
const fieldWidth = width - 40; // Adjust as necessary based on your design
const benchHeight = 100; // Adjust as per your design

const LineupEditScreen = ({ route, navigation }) => {
  const [lineup, setLineup] = useState([]);
  const [loading, setLoading] = useState(true);
  const teamId = route.params.teamId;

  // Fetch lineup on initial mount and whenever teamId changes
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    const fetchLineup = async () => {
      try {
        const response = await axiosInstance.get(`/lineup/${teamId}`);
        setLineup(response.data.lineup);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lineup:", error);
        setLoading(false);
      }
    };
    fetchLineup();
  }, [teamId]);

  // Save lineup positions when lineup changes (optional)
  const saveLineupPositions = useCallback(async () => {
    try {
      // Example: Save to AsyncStorage or any storage mechanism
      console.log("Lineup positions saved:", lineup);
    } catch (error) {
      console.error("Error saving lineup positions:", error);
    }
  }, [lineup]);

  // Fetch lineup positions when screen gains focus
  useFocusEffect(
    useCallback(() => {
      const fetchLineupPositions = async () => {
        try {
          // Example: Fetch from AsyncStorage or any storage mechanism
          console.log("Fetching lineup positions...");
        } catch (error) {
          console.error("Error fetching lineup positions:", error);
        }
      };

      fetchLineupPositions();

      // Cleanup function to save lineup positions when navigating away
      return saveLineupPositions;
    }, [saveLineupPositions])
  );

  const handleDragEnd = async (player, x, y, normalizedX, normalizedY) => {
    const isOnBench = y > pitchHeight - benchHeight;

    if (isOnBench) {
      // Place player on the bench
      x = 0;
      y = 0;
      normalizedX = 0;
      normalizedY = 0;
    } else {
      // Ensure player stays within field boundaries
      x = Math.max(0, Math.min(x, fieldWidth));
      y = Math.max(0, Math.min(y, pitchHeight));
    }

    const updatedPlayer = {
      ...player,
      x: normalizedX,
      y: normalizedY,
    };

    const newLineup = lineup.map((p) =>
      p.id === player.id ? updatedPlayer : p
    );
    setLineup(newLineup);

    try {
      await axiosInstance.put(`/lineup/update/${player.id}`, {
        x: normalizedX,
        y: normalizedY,
      });
    } catch (error) {
      console.error("Error updating lineup:", error);
    }
  };

  const handleBenchPress = (player) => {
    // Logic to remove player from bench and place on field
    const updatedPlayer = {
      ...player,
      x: 0, // Initial position on the field (adjust as needed)
      y: 0, // Initial position on the field (adjust as needed)
    };

    const newLineup = [...lineup, updatedPlayer];
    setLineup(newLineup);
  };

  const renderField = () => {
    const onFieldPlayers = lineup.filter(
      (player) => player.x !== 0 || player.y !== 0
    );
    const benchPlayers = lineup.filter(
      (player) => player.x === 0 && player.y === 0
    );

    return (
      <>
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
                  <Text style={styles.benchName}>{item.player.name}</Text>
                  <Text style={styles.benchPosition}>{item.position}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.benchScroll}
          />
        </View>
      </>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return <SafeAreaView style={styles.container}>{renderField()}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  pitchContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 3 / 4,
    marginBottom: 20,
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
