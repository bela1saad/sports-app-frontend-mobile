import React, { useState } from "react";
import {
  Button,
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons"; // Import vector icon library

const FileUploadComponent = ({ onImageSelected }) => {
  const [imageUri, setImageUri] = useState(null);
  const [error, setError] = useState(null);

  const pickImage = async () => {
    setError(null);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.cancelled) {
        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
          setImageUri(result.assets[0].uri);
          onImageSelected(result.assets[0].uri); // Pass the selected image URI to the parent component
        } else {
        }
      }
    } catch (error) {
      setError("Image picker error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity
            onPress={() => setImageUri(null)}
            style={styles.removeButton}
          >
            <Icon name="close-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick Image</Text>
          <Icon name="image-plus" size={24} color="white" style={styles.icon} />
        </TouchableOpacity>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#00000080", // Semi-transparent black
    padding: 5,
    borderRadius: 50,
  },
  button: {
    backgroundColor: "#05a759", // Use your secondary color here
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});

export default FileUploadComponent;
