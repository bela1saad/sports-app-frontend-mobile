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
  FlatList,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import axiosInstance from "../../utils/axios";
import CountryPicker, {
  CountryModalProvider,
} from "react-native-country-picker-modal";
import { Picker } from "@react-native-picker/picker";
import FileUploadComponent from "../../components/FileUploadComponent";
import supabase from "../../utils/supabaseConfig";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView } from "react-native";

const EditProfileScreen = () => {
  const [name, setName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [sports, setSports] = useState([]);
  const [chosenSport, setChosenSport] = useState("");
  const [chosenSportId, setChosenSportId] = useState(null);
  const [showCountryPickerState, setShowCountryPickerState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playerId, setPlayerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [positions, setPositions] = useState([]);
  const [chosenPosition, setChosenPosition] = useState("");
  const [chosenPositionId, setChosenPositionId] = useState(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showSportPicker, setShowSportPicker] = useState(false);
  const [profilePicUri, setProfilePicUri] = useState(null);
  const [city, setCity] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sportResponse = await axiosInstance.get("/sport/all");
        setSports(sportResponse.data);

        setPositions([]);

        const playerResponse = await axiosInstance.get("/player");
        const playerData = playerResponse.data;
        if (playerData && playerData.id) {
          setPlayerId(playerData.id);
          setName(playerData.name);
          setSelectedCountry(playerData.location);
          setCity(playerData.city);
          setChosenSport(playerData.sport);
          setChosenSportId(playerData.sport_id);
          setChosenPosition(playerData.position);
          setChosenPositionId(playerData.position_id);
          setProfilePicUri(playerData.pic);
          if (playerData.sport_id) {
            const positionResponse = await axiosInstance.get(
              `/sport/positions/${playerData.sport_id}`
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

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleImageSelected = (uri) => {
    setProfilePicUri(uri);
  };

  const handleCountrySelect = (countryName) => {
    setSelectedCountry(countryName);
    setShowCountryPickerState(false);
  };

  const fetchCitySuggestions = async (query) => {
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=city&limit=5&apiKey=d42674f055a346eab608a3347a4e5450`
      );
      setCitySuggestions(response.data.features);
      setShowCitySuggestions(true);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  const handleCityChange = (query) => {
    setCity(query);
    if (query.length > 2) {
      fetchCitySuggestions(query);
    } else {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  };

  const handleCitySelect = (city) => {
    setCity(city.properties.city);
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  const handleSelectSport = (sportId) => {
    const selectedSport = sports.find(
      (sport) => sport.id === parseInt(sportId, 10)
    );
    if (selectedSport) {
      setChosenSport(selectedSport);
      setChosenSportId(selectedSport.id);
      setShowModal(false);
      if (!positions.length || positions[0].sport_id !== sportId) {
        const fetchData = async () => {
          try {
            const positionResponse = await axiosInstance.get(
              `/sport/positions/${selectedSport.id}`
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

  const handleSelectPosition = (positionId) => {
    const selectedPositionId = parseInt(positionId, 10);
    const selectedPosition = positions.find(
      (position) => position.sport_position.positionId === selectedPositionId
    );
    if (selectedPosition) {
      setChosenPosition(selectedPosition);
      setChosenPositionId(selectedPositionId);
      setShowPositionModal(false);
    } else {
      console.log("Position not found");
    }
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

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let profilePicUrl = profilePicUri;
      if (profilePicUri && !profilePicUri.startsWith("http")) {
        profilePicUrl = await uploadImageToSupabase(profilePicUri);
      }

      const requestData = {
        name: name,
        pic: profilePicUrl,
        location: selectedCountry,
        city: city,
        sportId: chosenSportId,
        positionId: chosenPositionId,
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
          {profilePicUri && (
            <Image
              source={{ uri: profilePicUri }}
              style={styles.profileImage}
            />
          )}
        </View>
        <View style={styles.formContainer}>
          <FileUploadComponent onImageSelected={handleImageSelected} />
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#757575"
          />

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="City"
              value={city}
              onChangeText={setCity}
              style={styles.input}
              placeholderTextColor="#757575" // Set the placeholder text color to white
            />

            {citySuggestions.length > 0 && (
              <FlatList
                data={citySuggestions}
                keyExtractor={(item) => item.properties.geocoding_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleCitySelect(item)}
                    style={styles.citySuggestionItem}
                  >
                    <Text style={styles.citySuggestionText}>
                      {item.properties.city}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.citySuggestionsList}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowCountryPicker(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerButtonText}>
              {selectedCountry || "Select Country"}
            </Text>
          </TouchableOpacity>

          {showCountryPicker && (
            <View style={styles.countryPickerContainer}>
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

          <TouchableOpacity
            onPress={() => setShowSportPicker(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerButtonText}>
              {chosenSport ? chosenSport.name : "Choose a sport"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showSportPicker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowSportPicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Sport</Text>
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
              <Button
                title="Close"
                onPress={() => setShowSportPicker(false)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </Button>
            </View>
          </View>
        </Modal>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => setShowPositionModal(true)}
            style={styles.pickerButton}
          >
            <Text style={styles.pickerButtonText}>
              {chosenPosition ? chosenPosition.name : "Choose a position"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showPositionModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose a Position</Text>
              <Picker
                selectedValue={chosenPositionId}
                onValueChange={(itemValue) => handleSelectPosition(itemValue)}
                style={styles.picker}
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
              <Button
                title="Close"
                onPress={() => setShowPositionModal(false)}
                style={styles.modalButton}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.saveButton, loading && styles.disabledButton]}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save"}
            </Text>
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  returnArrow: {
    position: "absolute",
    top: Platform.OS === "ios" ? height * 0.05 : SPACING,
    left: SPACING,
    zIndex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: width * 0.05,
  },
  inputContainer: {
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#05a759",
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#05a759",
  },
  formContainer: {
    marginBottom: 30,
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
  pickerButton: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#303030",
  },
  pickerButtonText: {
    color: "#05a759",
    fontSize: 18,
    fontWeight: "600",
  },
  countryPickerContainer: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#303030",
  },
  citySuggestionsList: {
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#303030",
  },
  citySuggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#05a759",
  },
  citySuggestionText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  saveButton: {
    width: "60%",
    marginTop: -40,
    backgroundColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#8E8E8E",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    width: 300,
    borderRadius: 20,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: "#05a759",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
