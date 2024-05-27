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
  Image,
  Modal,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axiosInstance from "../utils/axios";
import FileUploadComponent from "../components/FileUploadComponent"; // Assuming you have this component

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
  const [imageUri, setImageUri] = useState(null); // New state for image URI
  const [showLevelPicker, setShowLevelPicker] = useState(false); // State to manage Picker visibility
  const levels = ["Excellent", "Intermediate", "Good", "Beginner"]; // Available levels

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const response = await axiosInstance.get("/team/");
        if (response.status === 200 && response.data) {
          setTeamInfo(response.data.team);
          setImageUri(response.data.team.pic); // Set the image URI
        }
      } catch (error) {
        console.error("Error fetching team info:", error);
      }
    };

    fetchTeamInfo();
  }, []);

  const handleSaveChanges = async () => {
    try {
      let updatedTeamInfo = { ...teamInfo };
      if (imageUri && imageUri !== teamInfo.pic) {
        const imageURL = await uploadImageToSupabase(imageUri);
        updatedTeamInfo = { ...updatedTeamInfo, pic: imageURL };
      }

      const response = await axiosInstance.put(
        "/api/team/edit",
        updatedTeamInfo
      );
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

  const handleImageSelected = (uri) => {
    setImageUri(uri);
  };

  const handleSelectLevel = (selectedLevel) => {
    console.log("Selected level:", selectedLevel);
    setTeamInfo({ ...teamInfo, level: selectedLevel });
    setShowLevelPicker(false);
  };

  console.log("Levels array:", levels);
  console.log("Team info level:", teamInfo.level);

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
          placeholderTextColor="#FFFFFF" // Set placeholder text color to white
          value={teamInfo.name}
          onChangeText={(text) => setTeamInfo({ ...teamInfo, name: text })}
        />

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : null}
        <FileUploadComponent onImageSelected={handleImageSelected} />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          placeholderTextColor="#FFFFFF" // Set placeholder text color to white
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
          placeholderTextColor="#FFFFFF" // Set placeholder text color to white
          value={teamInfo.up_for_game ? teamInfo.up_for_game.toString() : ""}
          onChangeText={(text) =>
            setTeamInfo({ ...teamInfo, up_for_game: text === "true" })
          }
        />
        <TextInput
          style={styles.input}
          placeholder="Max Number"
          placeholderTextColor="#FFFFFF" // Set placeholder text color to white
          value={teamInfo.maxNumber ? teamInfo.maxNumber.toString() : ""}
          onChangeText={(text) =>
            setTeamInfo({ ...teamInfo, maxNumber: parseInt(text) })
          }
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={() => {
            console.log("Opening level picker");
            setShowLevelPicker(true);
          }}
          style={styles.pickerButton}
        >
          <Text style={styles.pickerButtonText}>
            {teamInfo.level ? teamInfo.level : "Choose a level"}
          </Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={showLevelPicker}
          animationType="slide"
          onRequestClose={() => {
            console.log("Closing level picker");
            setShowLevelPicker(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Level</Text>
              <Picker
                selectedValue={teamInfo.level}
                onValueChange={(itemValue) => {
                  console.log("Selected level:", itemValue);
                  handleSelectLevel(itemValue);
                }}
                style={{ color: "#FFFFFF", backgroundColor: "#303030" }} // Adjusted styles
                dropdownIconColor="#05a759" // Adjusted styles
              >
                {levels.map((level) => (
                  <Picker.Item label={level} value={level} key={level} />
                ))}
              </Picker>

              <Button
                title="Close"
                onPress={() => {
                  console.log("Closing level picker");
                  setShowLevelPicker(false);
                }}
                style={styles.modalButton}
              />
            </View>
          </View>
        </Modal>

        <TextInput
          style={styles.input}
          placeholder="Sport ID"
          placeholderTextColor="#FFFFFF" // Set placeholder text color to white
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
    backgroundColor: "#101010",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#05a759",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: "#FFFFFF",
    backgroundColor: "#303030",
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 10,
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#303030",
    alignItems: "center",
  },
  pickerButtonText: {
    color: "#FFFFFF",
  },
});

export default EditTeamScreen;
