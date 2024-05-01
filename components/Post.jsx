import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import MaterialCommunityIcons package
import moment from "moment";
import { PostHeader, ReservationDetails, PostText } from "./PostComponents";
import WeatherForecast from "./WeatherForecast";

const { width } = Dimensions.get("window");

const Post = ({ post }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const apiKey = "71f13b1bfc72af220956260686155e4d";
  const handleSendRequest = () => {
    // Logic to send request
    // For demonstration, we're just setting the state
    setRequestSent(true);
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

  const formattedTime = moment(post.time, "hh:mm A").format("h:mm A"); // Format time with AM/PM indicator

  return (
    <TouchableOpacity onPress={() => setModalVisible(true)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <PostHeader
            profilePhoto={post.profilePhoto}
            name={post.name}
            postedAt={post.postedAt} // Pass the postedAt prop
          />
          <Icon
            name={getIconForType(post.type)}
            size={width * 0.06}
            color="#05a759"
          />
          {/* Use MaterialCommunityIcons for sports */}
          <Icon
            name={getSportIcon(post.sport)}
            size={width * 0.06}
            color="#05a759"
          />
        </View>

        <ReservationDetails
          time={formattedTime}
          date={formattedDate}
          club={post.club}
          level={post.level}
          sport={post.sport}
        />
        <PostText text={post.text} />

        {/* Modal Pop-up for Additional Details */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Booking Details</Text>
              {/* Reservation Details */}
              <ReservationDetails
                time={formattedTime}
                date={formattedDate}
                club={post.club}
                level={post.level}
                sport={post.sport}
              />
              {/* Weather Information */}
              {/* You can display temperature and weather icons here */}
              <View style={styles.weatherContainer}>
                <WeatherForecast
                  lat={post.lat} // Pass latitude from clubLocation
                  lon={post.lon} // Pass longitude from clubLocation
                  apiKey={apiKey}
                  bookingDate={post.date} // Pass booking date
                  bookingTime={post.time} // Pass booking time
                />
                {/* Add weather icons here */}
              </View>
              {/* Buttons */}
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
    case "player":
      return "account";
    case "team":
      return "account-group";
    // Add more types and their respective icons as needed
    default:
      return "help-circle"; // Default icon if type not found
  }
};
// Mapping of sports to MaterialCommunityIcons names
const getSportIcon = (sport) => {
  switch (sport) {
    case "Football":
      return "soccer";
    case "Basketball":
      return "basketball";
    case "Tennis":
      return "tennis";
    // Add more sports and their respective icons as needed
    default:
      return "help-circle"; // Default icon if sport not found
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
  weatherText: {
    fontSize: width * 0.04,
    color: "#333",
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
