import React, { useState, useEffect } from "react";
import { Button, Image, View, Text, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../config/initSupabase"; // Import your Supabase client

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
        alert("Permission to access camera roll is required.");
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

    const filename = imageUri.split("/").pop();

    try {
      const { data, error } = await supabase.storage
        .from("files")
        .upload(filename, imageUri, { public: true });

      if (error) {
        console.error("Image upload error:", error.message);
        alert("Image upload failed.");
        setError(error);
      } else {
        // Check if the uploaded file has a valid publicURL
        const imageUrl = data?.publicURL; // Use the 'publicURL' from the upload response
        console.log("Uploaded image URL:", imageUrl);

        if (imageUrl) {
          setImageUrl(imageUrl); // Set the imageUrl state to display the uploaded image

          // Save the imageUrl to your database (replace with your database saving logic)
          saveImageUrlToDatabase(imageUrl);
        } else {
          console.error("Public URL not found in upload response.");
          alert("Image upload failed. Public URL not found.");
          setError({ message: "Public URL not found." });
        }
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

  const saveImageUrlToDatabase = (imageUrl) => {
    // Implement your database saving logic here
    // Example: Make an API call to save imageUrl to your database
    console.log("Saving image URL to database:", imageUrl);
    // Your database saving logic goes here
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
      {/* Updated logic to display uploaded image */}
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
};

export default FileUploadComponent;
