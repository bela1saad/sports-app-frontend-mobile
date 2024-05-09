import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axiosInstance from "../../utils/axios";
import CountryPicker, {
  CountryModalProvider,
} from "react-native-country-picker-modal";
import { Picker } from "@react-native-picker/picker";

const { width, height } = Dimensions.get("window");

const EditProfileScreen = () => {
  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [sports, setSports] = useState([]);
  const [chosenSport, setChosenSport] = useState("");
  const [chosenSportId, setChosenSportId] = useState(null);
  const [, setShowCountryPickerState] = useState(false); // Use this syntax
  const [loading, setLoading] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [positions, setPositions] = useState([]);
  const [chosenPosition, setChosenPosition] = useState("");
  const [chosenPositionId, setChosenPositionId] = useState(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showSportPicker, setShowSportPicker] = useState(false); // Use separate state for sport picker

  const handleCountrySelect = (countryName) => {
    console.log("Selected country:", countryName);
    setSelectedCountry(countryName);
    setShowCountryPickerState(false); // Forced update
    console.log("showCountryPicker state after update:", showCountryPicker); // Might still show true
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sports data from the backend
        const sportResponse = await axiosInstance.get("/sport/all");
        console.log("Fetched sports data:", sportResponse.data);
        setSports(sportResponse.data);

        // Fetch positions data (initially empty)
        setPositions([]); // Reset positions initially

        // Fetch player data from the backend
        const playerResponse = await axiosInstance.get("/player");
        const playerData = playerResponse.data;
        if (playerData && playerData.id) {
          setPlayerId(playerData.id);
          setName(playerData.name);
          setSelectedCountry(playerData.location);
          setChosenSport(playerData.sport);
          setChosenSportId(playerData.sport_id);
          setChosenPosition(playerData.position); // If position data is available
          setChosenPositionId(playerData.position_id); // Set chosen position ID if available

          // If player has a sport selected, fetch positions for that sport
          if (playerData.sport_id) {
            const positionResponse = await axiosInstance.get(
              `/sport/positions/${playerData.sport_id}`
            );
            console.log(
              "Fetched positions data for player's sport:",
              positionResponse.data
            );
            setPositions(positionResponse.data);
          }
        } else {
          console.log("Player account does not exist");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSelectSport = (sportId) => {
    const selectedSport = sports.find(
      (sport) => sport.id === parseInt(sportId, 10)
    );
    if (selectedSport) {
      setChosenSport(selectedSport);
      setChosenSportId(selectedSport.id);

      // **Don't reset chosenPosition and chosenPositionId here**

      setShowModal(false);

      // Fetch positions for the newly chosen sport only if needed
      if (!positions.length || positions[0].sport_id !== sportId) {
        const fetchData = async () => {
          try {
            const positionResponse = await axiosInstance.get(
              `/sport/positions/${selectedSport.id}`
            );
            console.log(
              "Fetched positions data for chosen sport:",
              positionResponse.data
            );
            setPositions(positionResponse.data);
          } catch (error) {
            console.error("Error fetching positions:", error);
          }
        };
        fetchData();
      }
    } else {
      console.log("Sport not found");
    }
  };

  const handleOpenPositionPicker = () => {
    console.log("Opening sport picker modal"); // Add this line
    setShowModal(false); // Close position picker modal (if open)
    setShowSportPicker(true); // Open sport picker modal
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const requestData = {
        name: name,
        location: selectedCountry,
        sportId: chosenSportId,
        positionId: chosenPositionId, // Update to send position_id instead of position
      };
      console.log("Request data:", requestData); // Log the requestData object
      const endpoint = playerId
        ? `/player/update/${playerId}`
        : "/player/create";
      const method = playerId ? "PUT" : "POST";

      const response = await axiosInstance({
        method: method,
        url: endpoint,
        data: requestData,
      });

      setLoading(false);
      console.log("Position data sent to backend:", requestData); // Add this line
      Alert.alert(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        "An error occurred while updating your profile. Please try again later."
      );
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Edit Profile</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          margin: 10,
          width: 200,
        }}
      />
      <TouchableOpacity
        onPress={() => setShowCountryPicker(true)}
        style={[styles.countryPickerButton, { textDecorationLine: "none" }]} // Add style
      >
        <Text style={styles.countryPickerText}>
          {selectedCountry || "Select Country"}
        </Text>
      </TouchableOpacity>

      {showCountryPicker && (
        <View style={styles.countryPickerContainer}>
          {/* Add a container style */}
          <CountryModalProvider>
            <CountryPicker
              withFlag
              withCountryNameButton
              withFilter
              withAlphaFilter
              withEmoji
              onSelect={(value) => handleCountrySelect(value.name)}
            />
          </CountryModalProvider>
        </View>
      )}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => setShowSportPicker(true)}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            margin: 10,
            width: 150,
          }}
        >
          <Text>{chosenSport ? chosenSport.name : "Choose a sport"}</Text>
        </TouchableOpacity>
        <Button title="Save" onPress={handleSubmit} disabled={loading} />
      </View>

      <Modal
        visible={showSportPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSportPicker(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              width: 300,
              borderRadius: 20,
            }}
          >
            <Picker
              selectedValue={chosenSportId}
              onValueChange={(itemValue) => handleSelectSport(itemValue)}
            >
              <Picker.Item label="Select Sport" value="" />
              {sports.map((sport) => (
                <Picker.Item
                  label={sport.name}
                  value={sport.id}
                  key={sport.id}
                />
              ))}
            </Picker>
            <Button title="Close" onPress={() => setShowSportPicker(false)} />
          </View>
        </View>
      </Modal>

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="Position"
          value={chosenPosition ? chosenPosition.name : "Choose a position"}
          editable={false}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            margin: 10,
            width: 200,
          }}
          onTouchStart={() => setShowPositionModal(true)} // Open position picker modal
        />

        {chosenPosition &&
          console.log("Position in TextInput:", chosenPosition.name)}
      </View>

      <Modal visible={showPositionModal}>
        {positions.length > 0 && (
          <View>
            <Text style={{ marginBottom: 10 }}>Choose a Position</Text>
            <Picker
              selectedValue={chosenPositionId}
              onValueChange={(itemValue) => {
                const selectedPosition = positions.find(
                  (position) => position.sport_position.positionId === itemValue
                );
                setChosenPosition(selectedPosition); // Pass the entire position object
                setChosenPositionId(itemValue); // Update ID separately (optional)
                console.log("Selected position:", selectedPosition); // For verification

                console.log("Selected position ID:", itemValue);
                console.log("Selected position:", selectedPosition);
                console.log("Positions array:", positions);
              }}
            >
              <Picker.Item label="Select Position" value="" />
              {positions.map((position) => (
                <Picker.Item
                  label={position.name}
                  value={position.sport_position.positionId}
                  key={position.id}
                />
              ))}
            </Picker>
          </View>
        )}
        <Button title="Close" onPress={() => setShowPositionModal(false)} />
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  countryPickerButton: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    margin: 10,
    width: 200,
    alignItems: "center",
  },
  countryPickerText: {
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
export default EditProfileScreen;
