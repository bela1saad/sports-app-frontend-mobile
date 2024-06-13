import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axiosInstance from "../utils/axios";
import DraggablePlayer from "../components/DraggablePlayer";

const { width } = Dimensions.get("window");
const pitchHeight = width * 1.5;
const fieldWidth = width - 40; // Adjust as necessary based on your design

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
    // Ensure player stays within field boundaries
    x = Math.max(0, Math.min(x, fieldWidth));
    y = Math.max(0, Math.min(y, pitchHeight));

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

  // In renderField(), update DraggablePlayer usage:
  {
    lineup.map((player) => (
      <DraggablePlayer
        key={player.id}
        player={player}
        width={fieldWidth}
        pitchHeight={pitchHeight}
        onDragEnd={handleDragEnd}
      />
    ));
  }

  const renderField = () => {
    return (
      <View style={styles.pitchContainer}>
        <Image
          source={require("../assets/football_field.jpg")}
          style={styles.pitchBackground}
        />
        {lineup.map((player) => (
          <DraggablePlayer
            key={player.id} // Ensure each player has a unique key
            player={player}
            width={fieldWidth}
            pitchHeight={pitchHeight}
            onDragEnd={handleDragEnd}
          />
        ))}
      </View>
    );
  };

  const renderFormationButtons = () => {
    return (
      <View style={styles.formationButtonContainer}>
        <TouchableOpacity style={styles.formationButton}>
          <Text style={styles.formationButtonText}>4-4-2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.formationButton}>
          <Text style={styles.formationButtonText}>4-3-3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.formationButton}>
          <Text style={styles.formationButtonText}>3-5-2</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderFormationButtons()}
      {renderField()}
    </SafeAreaView>
  );
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
  },
  pitchBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
  formationButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  formationButton: {
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  formationButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default LineupEditScreen;
