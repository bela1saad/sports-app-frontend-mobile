import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Button,
  Calendar,
  Alert,
} from "react-native";
import axiosInstance from "../utils/axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const ReservationScreen = ({ route, navigation }) => {
  const { fieldId } = route.params; // Extracting fieldId from route params
  const [durations, setDurations] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchDurations();
  }, []);

  const fetchDurations = async () => {
    try {
      const response = await axiosInstance.get(`/duration/by-field/${fieldId}`);
      setDurations(response.data);
    } catch (error) {
      console.error("Error fetching durations:", error);
      Alert.alert(
        "Error",
        "Failed to fetch durations. Please try again later."
      );
    }
  };

  const fetchAvailability = async (durationId) => {
    try {
      const response = await axiosInstance.get(
        `/reservation/availability/${durationId}`
      );
      setAvailability(response.data);
      setShowCalendar(true); // Show calendar once availability is fetched
    } catch (error) {
      console.error("Error fetching availability:", error);
      Alert.alert(
        "Error",
        "Failed to fetch availability. Please try again later."
      );
    }
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    fetchAvailability(duration.id);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };

  const handleReservationPlayer = async () => {
    if (!selectedDuration || !selectedDate) {
      Alert.alert("Incomplete Selection", "Please select duration and date.");
      return;
    }
    try {
      const response = await axiosInstance.post("/reservation/player", {
        durationId: selectedDuration.id.toString(),
        date: selectedDate,
      });
      console.log("Player Reservation Success:", response.data);
      // Handle success scenario, navigate or show confirmation
    } catch (error) {
      console.error("Error making player reservation:", error);
      Alert.alert("Error", "Failed to make reservation. Please try again.");
    }
  };

  const handleReservationTeam = async () => {
    if (!selectedDuration || !selectedDate) {
      Alert.alert("Incomplete Selection", "Please select duration and date.");
      return;
    }
    try {
      const response = await axiosInstance.post("/reservation/team", {
        durationId: selectedDuration.id.toString(),
        date: selectedDate,
      });
      console.log("Team Reservation Success:", response.data);
      // Handle success scenario, navigate or show confirmation
    } catch (error) {
      console.error("Error making team reservation:", error);
      Alert.alert("Error", "Failed to make reservation. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Make a Reservation</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select Duration:</Text>
        <FlatList
          data={durations}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.durationItem,
                selectedDuration?.id === item.id && styles.selectedDuration,
              ]}
              onPress={() => handleDurationSelect(item)}
            >
              <Text style={styles.durationText}>{item.time} hours</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.durationList}
        />
        {showCalendar && (
          <>
            <Text style={styles.sectionTitle}>Select Date:</Text>
            <Calendar
              current={new Date()}
              onDayPress={(day) => handleDateSelect(day)}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: "#05a759" },
              }}
              minDate={new Date()}
              style={styles.calendar}
            />
          </>
        )}
        <View style={styles.buttonContainer}>
          <Button
            title="Reserve as Player"
            onPress={handleReservationPlayer}
            disabled={!selectedDuration || !selectedDate}
          />
          <Button
            title="Reserve as Team"
            onPress={handleReservationTeam}
            disabled={!selectedDuration || !selectedDate}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  header: {
    backgroundColor: "#05a759",
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  durationList: {
    marginBottom: 20,
  },
  durationItem: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#05a759",
    marginRight: 10,
  },
  selectedDuration: {
    backgroundColor: "#05a759",
  },
  durationText: {
    color: "#fff",
    fontSize: 16,
  },
  calendar: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default ReservationScreen;
