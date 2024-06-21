import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import MaterialCommunityIcons package
import moment from "moment";
import { PostHeader, ReservationDetails, PostText } from "./PostComponents";
import WeatherForecast from "./WeatherForecast";
import axiosInstance from "../utils/axios";

const { width } = Dimensions.get("window");

const Post = ({ post }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const apiKey = "71f13b1bfc72af220956260686155e4d";

  const handleSendRequest = async () => {
    try {
      const response = await axiosInstance.post(`/request/post/${post.id}`);
      if (response.status === 200) {
        setRequestSent(true);
        showSuccessMessage();
      }
    } catch (error) {
      console.error("Failed to send request:", error);
      if (error.response && error.response.status === 400) {
        const errorMessage =
          error.response.data.message || "Unknown error occurred";
        setErrorMessage(errorMessage);
        showErrorAlert(errorMessage);
      } else {
        showErrorAlert("An unexpected error occurred");
      }
    }
  };

  const showSuccessMessage = () => {
    Alert.alert(
      "Success",
      "Request Sent Successfully!",
      [{ text: "OK", onPress: () => setModalVisible(false) }],
      { cancelable: false }
    );
  };

  const showErrorAlert = (message) => {
    Alert.alert("Error", message, [{ text: "OK", onPress: () => {} }], {
      cancelable: false,
    });
  };

  let formattedDate = "";
  if (moment(post.date, "D/M/YYYY", true).isValid()) {
    const dateMoment = moment(post.date, "D/M/YYYY");
    formattedDate = `${dateMoment.format("D/M/YYYY")} ${dateMoment.format(
      "dddd"
    )}`;
  } else {
    formattedDate = "Invalid Date";
  }

  const formattedTime = moment(post.time, "hh:mm A").format("h:mm A");

  return (
    <TouchableOpacity onPress={() => setModalVisible(true)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <PostHeader
            profilePhoto={
              post.profilePhoto
                ? { uri: post.profilePhoto }
                : require("../assets/profile_photo.png")
            }
            name={post.name}
            postedAt={new Date(post.postedAt)}
          />
          <Icon
            name={getIconForType(post.type)}
            size={width * 0.06}
            color="#05a759"
          />
          <Icon
            name={getSportIcon(post.sport)}
            size={width * 0.06}
            color="#05a759"
          />
        </View>

        <ReservationDetails
          time={post.time}
          date={post.date}
          club={post.club}
          level={post.level}
          sport={post.sport}
        />
        <PostText text={post.text} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Booking Details</Text>
              <ReservationDetails
                time={post.time}
                date={post.date}
                club={post.club}
                level={post.level}
                sport={post.sport}
              />
              <View style={styles.weatherContainer}>
                <WeatherForecast
                  lat={40.453053}
                  lon={-3.688344}
                  apiKey={apiKey}
                  bookingDate={post.date}
                  bookingTime={post.time}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#05a759" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#007bff" }]}
                  onPress={handleSendRequest}
                  disabled={requestSent}
                >
                  <Text style={styles.buttonText}>
                    {requestSent ? "Request Sent" : "Send Request"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableOpacity>
  );
};

const getIconForType = (type) => {
  switch (type) {
    case "needPlayer":
      return "account";
    case "needEnemyTeam":
      return "account-group";
    default:
      return "help-circle";
  }
};

const getSportIcon = (sport) => {
  switch (sport) {
    case "Football":
      return "soccer";
    case "Basketball":
      return "basketball";
    case "Tennis":
      return "tennis";
    default:
      return "help-circle";
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    padding: width * 0.04,
    borderRadius: 10,
    marginBottom: width * 0.04,
    elevation: 2,
    top: width * 0.04,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: width * 0.025,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#222222",
    borderRadius: 10,
    padding: width * 0.05,
    minWidth: width * 0.4,
  },
  modalText: {
    fontSize: width * 0.06,
    marginBottom: width * 0.025,
    color: "#05a759",
    fontWeight: "bold",
    textAlign: "center",
  },
  weatherContainer: {
    marginTop: width * 0.025,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: width * 0.025,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: width * 0.05,
  },
  modalButton: {
    flex: 1,
    padding: width * 0.025,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: width * 0.01,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.04,
  },
});

export default Post;
