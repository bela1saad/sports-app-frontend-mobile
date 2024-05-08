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

  const [loading, setLoading] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [positions, setPositions] = useState([]);
  const [chosenPosition, setChosenPosition] = useState("");
  const [chosenPositionId, setChosenPositionId] = useState(null);

  const handleCountrySelect = (countryName) => {
    setSelectedCountry(countryName);
    setShowCountryPicker(false); // Close the country picker after selection
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sports data from the backend
        const sportResponse = await axiosInstance.get("/sport/all");
        setSports(sportResponse.data);

        // Fetch positions data from the backend
        const positionResponse = await axiosInstance.get("/position/all");
        setPositions(positionResponse.data);

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
      setShowModal(false);
    } else {
      console.log("Sport not found");
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const requestData = {
        name: name,
        location: selectedCountry,
        sportId: chosenSportId,
        position: chosenPosition,
      };

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
        style={styles.countryPickerButton}
      >
        <Text style={styles.countryPickerText}>
          {selectedCountry || "Select Country"}
        </Text>
      </TouchableOpacity>
      {showCountryPicker && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCountryPicker(false)}
        >
          <View style={styles.modalContainer}>
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
        </Modal>
      )}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="Sport"
          value={chosenSport ? chosenSport.name : "Choose a sport"}
          editable={false}
          style={{
            borderWidth: 1,
            borderColor: "gray",
            padding: 10,
            margin: 10,
            width: 150,
          }}
          onTouchStart={() => setShowModal(true)}
        />
        <Button title="Save" onPress={handleSubmit} disabled={loading} />
      </View>
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
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
            <Button title="Close" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
      {/* Position TextInput */}
      <TextInput
        placeholder="Position"
        value={chosenPosition}
        onChangeText={setChosenPosition}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          margin: 10,
          width: 200,
        }}
      />
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
