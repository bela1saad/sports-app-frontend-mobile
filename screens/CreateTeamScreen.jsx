import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import axiosInstance from "../utils/axios";
import FileUploadComponent from "../components/FileUploadComponent";
import { Picker } from "@react-native-picker/picker";
import supabase from "../utils/supabaseConfig"; // Import Supabase
import { KeyboardAvoidingView } from "react-native";

const CreateTeamScreen = ({ navigation }) => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [maxNumber, setMaxNumber] = useState("");
  const [sportId, setSportId] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [sports, setSports] = useState([]);
  const [chosenSport, setChosenSport] = useState("");
  const [chosenSportId, setChosenSportId] = useState(null);
  const [levels] = useState(["Excellent", "Intermediate", "Good", "Beginner"]);
  const [chosenLevel, setChosenLevel] = useState("");
  const [showSportPicker, setShowSportPicker] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);

  const [selectedMaxNumber, setSelectedMaxNumber] = useState("");
  const maxNumbers = Array.from({ length: 14 }, (_, i) => i + 1);
  const [chosenMaxNumber, setChosenMaxNumber] = useState("");
  const [showMaxNumberPicker, setShowMaxNumberPicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportResponse = await axiosInstance.get("/sport/all");
        console.log("LOG Fetched sports:", sportResponse.data); // Added log
        setSports(sportResponse.data);
      } catch (error) {
        console.error("Error fetching sports:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSelectSport = (sportId) => {
    const selectedSport = sports.find(
      (sport) => sport.id === parseInt(sportId, 10)
    );

    if (selectedSport) {
      setChosenSport(selectedSport);
      setChosenSportId(selectedSport.id);
      setShowSportPicker(false);
      console.log("LOG Selected sport:", selectedSport); // Added log
    } else {
      console.log("Sport not found");
    }
  };

  // Inside the component function, add a function to handle selecting the maximum number
  const handleSelectMaxNumber = (selectedMaxNumber) => {
    setChosenMaxNumber(parseInt(selectedMaxNumber));
    setMaxNumber(selectedMaxNumber); // Update maxNumber state
    setShowMaxNumberPicker(false);
    console.log("LOG Selected max number:", selectedMaxNumber); // Added log
  };

  const handleSelectLevel = (selectedLevel) => {
    setChosenLevel(selectedLevel);
    setShowLevelPicker(false);
    console.log("LOG Selected level:", selectedLevel); // Added log
  };

  const uploadImageToSupabase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    const filename = uri.split("/").pop();

    const { data, error } = await supabase.storage
      .from("files")
      .upload(filename, arrayBuffer);
    if (error) {
      throw new Error(error.message);
    }
    return `${supabase.storageUrl}/object/public/files/${filename}`;
  };

  const handleCreateTeam = async () => {
    try {
      let imageURL = "";

      if (imageUri) {
        // Upload image to Supabase
        imageURL = await uploadImageToSupabase(imageUri);
      }

      console.log("LOG Creating team with the following data:");
      console.log("LOG Name:", teamName);
      console.log("LOG Description:", description);
      console.log("LOG Max Number:", maxNumber); // Added log
      console.log("LOG Level:", chosenLevel);
      console.log("LOG Sport ID:", chosenSportId);
      console.log("LOG Image URL:", imageURL);

      const response = await axiosInstance.post("/team/create", {
        name: teamName,
        description,
        maxNumber: maxNumber, // Updated
        level: chosenLevel,
        sport_id: chosenSportId,
        pic: imageURL,
      });

      if (response.data.team) {
        alert("Team created successfully!");
        navigation.navigate("MainTabs", {
          screen: "Team",
          params: { team: response.data.team },
        });
      }
    } catch (error) {
      console.error("ERROR Error creating team:", error); // Updated log
      alert("Error creating team. Please try again.");
    }
  };
  const handleImageSelected = (uri) => {
    setImageUri(uri); // Corrected
  };
  const renderMaxNumberPicker = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Max Number</Text>
        <Picker
          selectedValue={chosenMaxNumber}
          onValueChange={(itemValue) => handleSelectMaxNumber(itemValue)}
        >
          <Picker.Item label="Select max number" value="" />
          {maxNumbers.map((number) => (
            <Picker.Item
              label={number.toString()}
              value={number.toString()}
              key={number}
            />
          ))}
        </Picker>
        <Button
          title="Close"
          onPress={() => setShowMaxNumberPicker(false)}
          style={styles.modalButton}
        >
          <Text style={styles.modalButtonText}>Close</Text>
        </Button>
      </View>
    </View>
  );
  // Function to render the sport picker modal content
  const renderSportPicker = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Sport</Text>
        <Picker
          selectedValue={chosenSportId}
          onValueChange={(itemValue) => handleSelectSport(itemValue)}
        >
          <Picker.Item label="Select Sport" value="" />
          {sports.map((sport) => (
            <Picker.Item label={sport.name} value={sport.id} key={sport.id} />
          ))}
        </Picker>
        <Button
          title="Close"
          onPress={() => setShowSportPicker(false)}
          style={styles.modalButton}
        />
      </View>
    </View>
  );

  // Function to render the level picker modal content
  const renderLevelPicker = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Level</Text>
        <Picker
          selectedValue={chosenLevel}
          onValueChange={(itemValue) => handleSelectLevel(itemValue)}
        >
          <Picker.Item label="Select Level" value="" />
          {levels.map((level) => (
            <Picker.Item label={level} value={level} key={level} />
          ))}
        </Picker>
        <Button
          title="Close"
          onPress={() => setShowLevelPicker(false)}
          style={styles.modalButton}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Create a New Team</Text>
          <TextInput
            style={styles.input}
            placeholder="Team Name"
            value={teamName}
            onChangeText={setTeamName}
          />
          <TouchableOpacity
            onPress={() => setShowMaxNumberPicker(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerButtonText}>
              {maxNumber ? maxNumber : "Choose max number"}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={showMaxNumberPicker}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowMaxNumberPicker(false)}
          >
            {renderMaxNumberPicker()}
          </Modal>
          <TouchableOpacity
            onPress={() => setShowSportPicker(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerButtonText}>
              {chosenSport ? chosenSport.name : "Choose a sport"}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={showSportPicker}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowSportPicker(false)}
          >
            {renderSportPicker()}
          </Modal>
          <TouchableOpacity
            onPress={() => setShowLevelPicker(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerButtonText}>
              {chosenLevel ? chosenLevel : "Choose a level"}
            </Text>
          </TouchableOpacity>
          <Modal
            visible={showLevelPicker}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowLevelPicker(false)}
          >
            {renderLevelPicker()}
          </Modal>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]} // Adjusted style
              placeholder="Enter Description"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
            />
          </View>
          <FileUploadComponent onImageSelected={handleImageSelected} />
          <TouchableOpacity
            onPress={handleCreateTeam}
            style={styles.customButton}
          >
            <Text style={styles.customButtonText}>Create Team</Text>
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
    paddingTop: height * 0.05, // Adjusted padding
  },
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: "#101010",
    paddingHorizontal: SPACING,
    paddingTop: height * 0.05, // Adjusted padding
  },
  title: {
    fontSize: width * 0.06, // Adjusted font size
    fontWeight: "bold",
    color: "#05a759",
    marginBottom: SPACING,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: height * 0.02, // Adjusted padding
    paddingHorizontal: width * 0.04, // Adjusted padding
    marginBottom: SPACING,
    color: "#FFFFFF",
    backgroundColor: "#303030",
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: height * 0.025, // Adjusted padding
    paddingHorizontal: width * 0.04, // Adjusted padding
    marginBottom: SPACING,
    alignItems: "center",
    backgroundColor: "#303030",
  },
  pickerButtonText: {
    color: "#05a759",
    fontSize: width * 0.04, // Adjusted font size
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
    width: width * 0.8, // Adjusted width
    borderRadius: 20,
  },
  modalButton: {
    marginTop: SPACING,
    backgroundColor: "#05a759",
    borderRadius: 10,
    paddingVertical: height * 0.025, // Adjusted padding
    paddingHorizontal: width * 0.04, // Adjusted padding
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04, // Adjusted font size
    fontWeight: "bold",
  },
  descriptionContainer: {
    marginBottom: SPACING,
  },
  descriptionLabel: {
    fontSize: width * 0.04, // Adjusted font size
    fontWeight: "bold",
    color: "#05a759",
    marginBottom: SPACING * 0.5, // Adjusted margin
  },
  descriptionInput: {
    height: height * 0.15, // Adjusted height
    paddingHorizontal: width * 0.04, // Adjusted padding
  },
  customButton: {
    backgroundColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android shadow
    marginBottom: 20, // Adjusted margin
  },
  customButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateTeamScreen;
