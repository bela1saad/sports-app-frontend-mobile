import React, { useState } from "react";
import { View, Text, Button, Image, TextInput, Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";
import * as Permissions from "expo-permissions"; // Import for Android permissions (optional)
import * as ImagePicker from "expo-image-picker";

const FileUploadComponent = ({ onUploadSuccess }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imagePath, setImagePath] = useState("");
  const supabaseUrl = "https://wznpzguqtwktpfeoccwk.supabase.co"; // Replace with your Supabase URL
  const supabaseAnonKey =
    "<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bnB6Z3VxdHdrdHBmZW9jY3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0NDA1MzgsImV4cCI6MjAzMTAxNjUzOH0.Y0cA9FIP1afwPaZChrleu95wgsP9mWGrB7rxuTWWIgk>"; // Replace with your Supabase public key

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const pickImage = async () => {
    console.log("Permissions check started");
    if (Platform.OS === "android") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to use the image picker");
        return;
      }
    }
    console.log("Permissions check completed");

    // Wait for ImagePicker to be ready (if necessary)
    await new Promise((resolve) => setTimeout(resolve, 0));

    const options = {
      title: "Select Image",
      storageOptions: {
        skipBackup: true, // Optional: skip backing up the selected image to iCloud
        path: "images", // Optional: custom path for the image (default: 'Camera')
      },
    };

    try {
      console.log("ImagePicker launched");
      const result = await ImagePicker.launchImageLibraryAsync(options);
      console.log("ImagePicker result:", result);

      // Check for user cancellation or errors before accessing properties
      if (!result.didCancel && !result.error) {
        await setImagePath(result.uri); // Await setting imagePath
        console.log("Setting imagePath:", result.uri);
      } else if (result.error) {
        console.error("ImagePicker error:", result.error);
        alert("Image picker error:", result.error.message);
      }
    } catch (error) {
      // Handle any unexpected errors during ImagePicker interaction
      console.error("Unexpected ImagePicker error:", error);
      alert("Unexpected image picker error:", error.message);
    }
  };

  const handleUpload = async () => {
    await pickImage();
    if (imagePath !== "") {
      uploadImage();
    } else {
      alert("Please select an image first.");
    }
  };

  const uploadImage = async () => {
    console.log("Uploading image:", imagePath);

    const { data, error } = await supabase.storage
      .from("files") // Replace 'images' with your bucket name
      .upload(imagePath, { public: true }); // Set public for anonymous access

    if (error) {
      console.error("Image upload error:", error);
      alert("Image upload failed.");
      return;
    }

    setImageUrl(data.publicUrl);
    onUploadSuccess(data.publicUrl); // Call the provided callback function
    console.log("Image uploaded successfully:", data.publicUrl);
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick Image" onPress={handleUpload} />
      {imagePath !== "" && <Text>Selected Image: {imagePath}</Text>}
      <TextInput
        value={imageUrl}
        editable={false}
        placeholder="Image URL (after upload)"
      />
      {imageUrl !== "" && (
        <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
      )}
      <Button
        title="Upload Image"
        onPress={uploadImage}
        disabled={imagePath === ""}
      />
    </View>
  );
};

export default FileUploadComponent;
