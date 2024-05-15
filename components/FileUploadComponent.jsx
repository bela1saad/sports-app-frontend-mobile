import React, { useState, useEffect } from "react";
import { Button, Image, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../config/initSupabase";

const FileUploadComponent = () => {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required.");
      }
    })();
  }, []);

  const pickImage = async () => {
    setError(null);
    setUploading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log("ImagePicker result:", result);

      if (!result.cancelled) {
        // Check if image selection was not cancelled
        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
          setImageUri(result.assets[0].uri); // Use the URI from the first asset
          console.log("Image selected:", result.assets[0].uri);
        } else {
          console.log("No URI returned for selected image.");
          alert("Selected image URI is missing.");
        }
      } else {
        console.log("Image selection cancelled.");
        alert("Image selection was cancelled.");
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
      alert("Image picker error:", error.message);
      setError(error);
    } finally {
      setUploading(false);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      alert("Please select an image to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const arrayBuffer = await new Response(blob).arrayBuffer();

      // Get the filename from the imageUri
      const filename = imageUri.split("/").pop(); // Extract the filename from the URI

      const { data, error } = await supabase.storage
        .from("files") // Specify your bucket name here
        .upload(filename, arrayBuffer); // Use the extracted filename for upload

      if (error) {
        alert("Image upload failed.");
        setError(error);
      } else {
        // Construct the image URL using the Supabase storage URL and filename
        const imageUrl = `${supabase.storageUrl}/object/public/files/${filename}`;
        setImageUrl(imageUrl);
        console.log("Uploaded image URL:", imageUrl);
      }
    } catch (error) {
      console.error("Supabase storage upload error:", error.message);
      alert(
        "Image upload failed. Please check your Supabase connection and storage settings."
      );
      setError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <Button title="Pick Image" onPress={pickImage} disabled={uploading} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
      {uploading ? (
        <Text>Uploading image...</Text>
      ) : (
        <Button
          title="Upload Image"
          onPress={uploadImage}
          disabled={!imageUri}
        />
      )}
      {imageUrl && <Text>Uploaded image URL: {imageUrl}</Text>}
      {error && <Text style={{ color: "red" }}>Error: {error.message}</Text>}
    </View>
  );
};

export default FileUploadComponent;
