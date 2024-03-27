import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const PostHeader = ({ profilePhoto, name, postedAt }) => {
  // Calculate elapsed time since the post was posted
  const elapsedTime = calculateElapsedTime(postedAt);

  return (
    <View style={styles.headerContainer}>
      <Image source={profilePhoto} style={styles.profilePhoto} />
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.elapsedTime}>{elapsedTime}</Text>
      </View>
    </View>
  );
};

const calculateElapsedTime = (postedAt) => {
  const now = new Date();

  const elapsedMilliseconds = now - postedAt;

  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedHours >= 24) {
    return `${Math.floor(elapsedHours / 24)} days ago`;
  } else if (elapsedHours > 0) {
    return `${elapsedHours} hours ago`;
  } else if (elapsedMinutes > 0) {
    return `${elapsedMinutes} minutes ago`;
  } else {
    return "Just now";
  }
};

const ReservationDetails = ({ time, date, club, level, sport }) => {
  return (
    <View style={styles.detailsContainer}>
      <View style={styles.detailRow}>
        <Icon name="clock-o" size={18} color="#05a759" style={styles.icon} />
        <Text style={styles.detailsText}>{`Time: ${time}`}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="calendar" size={18} color="#05a759" style={styles.icon} />
        <Text style={styles.detailsText}>{`Date: ${date}`}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="futbol-o" size={18} color="#05a759" style={styles.icon} />
        <Text style={styles.detailsText}>{`Sport: ${sport}`}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="users" size={18} color="#05a759" style={styles.icon} />
        <Text style={styles.detailsText}>{`Club: ${club}`}</Text>
      </View>
      <View style={styles.detailRow}>
        <Icon name="star" size={18} color="#05a759" style={styles.icon} />
        <Text style={styles.detailsText}>{`Level: ${level}`}</Text>
      </View>
    </View>
  );
};

const PostText = ({ text }) => {
  return (
    <View style={styles.textContainer}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const { width } = Dimensions.get("window");
const FONT_SIZE_BASE = 16; // Base font size for average screen size

// Calculate the font scale factor based on the screen width
const fontScaleFactor = width < 360 ? 0.9 : width < 414 ? 1 : 1.1;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: FONT_SIZE_BASE * fontScaleFactor,
    fontWeight: "bold",
    color: "#05a759",
  },
  elapsedTime: {
    color: "#FFFFFF",
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsText: {
    fontSize: FONT_SIZE_BASE * fontScaleFactor,
    marginBottom: 5,
    color: "#FFFFFF",
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
  textContainer: {
    marginBottom: 10,
  },
  text: {
    fontSize: FONT_SIZE_BASE * fontScaleFactor,
    color: "#FFFFFF",
  },
});

export default styles;

export { PostHeader, ReservationDetails, PostText };
