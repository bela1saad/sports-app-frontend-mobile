import React, { useState } from "react";
import { Button, Image, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

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
    <View>
      <Button title="Pick Image" onPress={pickImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
      {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
    </View>
  );
};

export default FileUploadComponent;
