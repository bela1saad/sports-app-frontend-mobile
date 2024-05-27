import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axiosInstance from "../utils/axios";

const EditTeamScreen = ({ navigation }) => {
  const [teamInfo, setTeamInfo] = useState({
    name: "",
    pic: "",
    description: "",
    up_for_game: false,
    maxNumber: "",
    level: "",
    sport_id: "",
  });

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const response = await axiosInstance.get("/team/");
        if (response.status === 200 && response.data) {
          setTeamInfo(response.data.team);
        }
      } catch (error) {
        console.error("Error fetching team info:", error);
      }
    };

    fetchTeamInfo();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put("/api/team/edit", teamInfo);
      if (response.status === 200 && response.data) {
        Alert.alert("Success", "Team information updated successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Error updating team info:", error);
      Alert.alert(
        "Error",
        "Error updating team information. Please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Team Information</Text>
        <TextInput
          style={styles.input}
          placeholder="Team Name"
          value={teamInfo.name}
          onChangeText={(text) => setTeamInfo({ ...teamInfo, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Team Picture URL"
          value={teamInfo.pic}
          onChangeText={(text) => setTeamInfo({ ...teamInfo, pic: text })}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          value={teamInfo.description}
          onChangeText={(text) =>
            setTeamInfo({ ...teamInfo, description: text })
          }
          multiline={true}
          numberOfLines={4}
        />
        <TextInput
          style={styles.input}
          placeholder="Up For Game (true/false)"
          value={teamInfo.up_for_game ? teamInfo.up_for_game.toString() : ""}
          onChangeText={(text) =>
            setTeamInfo({ ...teamInfo, up_for_game: text === "true" })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Max Number"
          value={teamInfo.maxNumber ? teamInfo.maxNumber.toString() : ""}
          onChangeText={(text) =>
            setTeamInfo({ ...teamInfo, maxNumber: parseInt(text) })
          }
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Level (Excellent/Intermediate/Good/Beginner)"
          value={teamInfo.level ? teamInfo.level : ""}
          onChangeText={(text) => setTeamInfo({ ...teamInfo, level: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Sport ID"
          value={teamInfo.sport_id ? teamInfo.sport_id.toString() : ""}
          onChangeText={(text) =>
            setTeamInfo({ ...teamInfo, sport_id: parseInt(text) })
          }
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={handleSaveChanges}
          style={styles.customButton}
        >
          <Text style={styles.customButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  descriptionInput: {
    height: 100,
  },
  customButton: {
    backgroundColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  customButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default EditTeamScreen;
