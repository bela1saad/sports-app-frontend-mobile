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
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axiosInstance from "../utils/axios";
import FileUploadComponent from "../components/FileUploadComponent";
import supabase from "../utils/supabaseConfig"; // Import Supabase

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
  const [imageUri, setImageUri] = useState(null);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const levels = ["Excellent", "Intermediate", "Good", "Beginner"];
  const maxNumbers = Array.from({ length: 14 }, (_, i) => i + 1);
  const [chosenMaxNumber, setChosenMaxNumber] = useState("");
  const [showMaxNumberPicker, setShowMaxNumberPicker] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const fetchTeamInfo = async () => {
      try {
        const response = await axiosInstance.get("/team/");
        if (response.status === 200 && response.data) {
          console.log("Team data fetched successfully:", response.data.team);
          setTeamInfo({
            name: response.data.team.name || "",
            pic: response.data.team.pic || "",
            description: response.data.team.description || "",
            up_for_game: response.data.team.up_for_game || false,
            maxNumber: response.data.team.max_number || "", // Updated key
            level: response.data.team.level || "",
            sport_id: response.data.team.sport_id || "",
          });

          setImageUri(response.data.team.pic);
        } else {
          console.log("Unexpected response:", response);
        }
      } catch (error) {
        console.error("Error fetching team info:", error);
      }
    };

    fetchTeamInfo();
  }, [navigation]);

  const handleSaveChanges = async () => {
    try {
      let updatedTeamInfo = { ...teamInfo };
      if (imageUri && imageUri !== teamInfo.pic) {
        const imageURL = await uploadImageToSupabase(imageUri);
        updatedTeamInfo = { ...updatedTeamInfo, pic: imageURL };
      }

      const response = await axiosInstance.put("/team/edit", updatedTeamInfo);
      if (response.status === 200 && response.data) {
        Alert.alert("Success", "Team information updated successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      console.error("Error updating team info:", error);
      Alert.alert("Error", response.data.message);
    }
  };

  const handleImageSelected = (uri) => {
    setImageUri(uri);
  };

  const handleSelectLevel = (selectedLevel) => {
    setTeamInfo({ ...teamInfo, level: selectedLevel });
    setShowLevelPicker(false);
  };

  const handleSelectMaxNumber = (selectedNumber) => {
    setTeamInfo({ ...teamInfo, maxNumber: selectedNumber });
    setShowMaxNumberPicker(false);
  };

  const uploadImageToSupabase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    const filename = uri.split("/").pop();

    const { data, error } = await supabase.storage
      .from("files")
      .upload(filename, arrayBuffer);
    if (error) throw new Error(error.message);

    return `${supabase.storageUrl}/object/public/files/${filename}`;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Edit Team Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Team Name"
            placeholderTextColor="#FFFFFF"
            value={teamInfo.name}
            onChangeText={(text) => setTeamInfo({ ...teamInfo, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            placeholderTextColor="#FFFFFF"
            value={teamInfo.description}
            onChangeText={(text) =>
              setTeamInfo({ ...teamInfo, description: text })
            }
          />

          <TouchableOpacity
            onPress={() => setShowMaxNumberPicker(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerButtonText}>
              {teamInfo.maxNumber || "Select Max Number"}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={showMaxNumberPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowMaxNumberPicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Max Number</Text>
                <Picker
                  selectedValue={teamInfo.maxNumber}
                  onValueChange={(itemValue) =>
                    handleSelectMaxNumber(itemValue)
                  }
                >
                  {maxNumbers.map((number) => (
                    <Picker.Item
                      key={number}
                      label={number.toString()}
                      value={number}
                    />
                  ))}
                </Picker>
                <Button
                  title="Close"
                  onPress={() => setShowMaxNumberPicker(false)}
                />
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            onPress={() => setShowLevelPicker(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerButtonText}>
              {teamInfo.level || "Select Level"}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={showLevelPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowLevelPicker(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Level</Text>
                <Picker
                  selectedValue={teamInfo.level}
                  onValueChange={handleSelectLevel}
                >
                  {levels.map((level) => (
                    <Picker.Item key={level} label={level} value={level} />
                  ))}
                </Picker>
                <Button
                  title="Close"
                  onPress={() => setShowLevelPicker(false)}
                />
              </View>
            </View>
          </Modal>
          <FileUploadComponent onImageSelected={handleImageSelected} />
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          )}
          <TouchableOpacity
            onPress={handleSaveChanges}
            style={styles.customButton}
          >
            <Text style={styles.customButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const { width, height } = Dimensions.get("window");
const SPACING = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    paddingHorizontal: SPACING,
    paddingTop: height * 0.05,
  },
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: "#101010",
    paddingHorizontal: SPACING,
    paddingTop: height * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#05a759",
    marginBottom: SPACING,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    marginBottom: SPACING,
    color: "#FFFFFF",
    backgroundColor: "#303030",
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.04,
    marginBottom: SPACING,
    alignItems: "center",
    backgroundColor: "#303030",
  },
  pickerButtonText: {
    color: "#05a759",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: SPACING,
    width: width * 0.8,
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#05a759",
    marginBottom: SPACING,
    textAlign: "center",
  },
  modalButton: {
    marginTop: SPACING,
    backgroundColor: "#05a759",
    borderRadius: 10,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.04,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginBottom: SPACING,
    borderRadius: 10,
  },
  customButton: {
    backgroundColor: "#05a759",
    borderRadius: 10,
    paddingVertical: height * 0.025,
    paddingHorizontal: width * 0.04,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: SPACING,
  },
  customButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
    fontWeight: "bold",
  },
});

export default EditTeamScreen;
