import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  Dimensions,
  StyleSheet,
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
  const [sports, setSports] = useState([]);
  const [chosenSport, setChosenSport] = useState("");
  const [chosenSportId, setChosenSportId] = useState(""); // New state to store the sport ID
  const [loading, setLoading] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sports data from the backend
        const sportResponse = await axiosInstance.get("/sport/all");
        setSports(sportResponse.data);

        // Fetch player data from the backend
        const playerResponse = await axiosInstance.get("/player");
        const playerData = playerResponse.data;
        if (playerData && playerData.id) {
          setPlayerId(playerData.id);
          setName(playerData.name);
          setSelectedCountry(playerData.location);
          // Set the chosen sport and its ID from playerData
          setChosenSport(playerData.sport);
          setChosenSportId(playerData.sport_id);
        } else {
          console.log("Player account does not exist");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSelectSport = (sport) => {
    // Set the chosen sport and its ID
    setChosenSport(sport.name);
    setChosenSportId(sport.id);
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Log the chosenSportId state
      console.log("Chosen Sport ID:", chosenSportId);

      const requestData = {
        name: name,
        location: selectedCountry,
        sport_id: chosenSportId, // Send the chosen sport ID instead of the name
      };

      console.log("Data:", requestData);

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
      <CountryModalProvider>
        <CountryPicker
          countryCode={selectedCountry && selectedCountry.cca2}
          withFlag={true}
          withCountryNameButton
          withFilter
          withAlphaFilter
          withEmoji
          onSelect={(value) => {
            const countryName = value.name; // Extract the country name
            setSelectedCountry(countryName); // Pass only the country name
          }}
        />
      </CountryModalProvider>
      <TextInput
        placeholder="Country"
        value={selectedCountry}
        onChangeText={setSelectedCountry}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          margin: 10,
          width: 200,
        }}
      />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="Sport"
          value={chosenSport || "Choose a sport"}
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
              selectedValue={chosenSportId} // Use the sport ID as the selected value
              onValueChange={(itemValue) => handleSelectSport(itemValue)}
            >
              <Picker.Item label="Select Sport" value="" />
              {sports.map((sport) => (
                <Picker.Item
                  label={sport.name}
                  value={sport.id} // Use the sport ID as the value
                  key={sport.id}
                />
              ))}
            </Picker>
            <Button title="Close" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditProfileScreen;
