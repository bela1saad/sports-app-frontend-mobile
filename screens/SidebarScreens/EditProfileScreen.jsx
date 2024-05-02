import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const handleImageUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Camera roll permission denied");
      }

      const imagePickerResult = await ImagePicker.launchImageLibraryAsync();
      if (imagePickerResult.cancelled) {
        throw new Error("Image selection cancelled");
      }

      setImage(imagePickerResult.uri);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);

      const response = await axios.post(
        "http://192.168.43.48:4000/api/player/create",
        formData,
        {
          headers: {
            Authorization: "Bearer " + AsyncStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

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
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          margin: 10,
          width: 200,
        }}
      />
      <Button
        title="Upload Image"
        onPress={handleImageUpload}
        disabled={loading}
      />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, margin: 10 }}
        />
      )}
      <Button title="Save" onPress={handleSubmit} disabled={loading} />
    </View>
  );
};

export default EditProfileScreen;
