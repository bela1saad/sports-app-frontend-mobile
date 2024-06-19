import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import axiosInstance from "../utils/axios";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";

const ReservationScreen = ({ route }) => {
  const { fieldId } = route.params;
  const navigation = useNavigation();

  const [durations, setDurations] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availability, setAvailability] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [minDate, setMinDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
      markAvailableDates(response.data);
      setShowCalendar(true);
    } catch (error) {
      console.error("Error fetching availability:", error);
      Alert.alert(
        "Error",
        "Failed to fetch availability. Please try again later."
      );
    }
  };

  const markAvailableDates = (availableDates) => {
    const markedDatesObject = {};
    availableDates.forEach((date) => {
      markedDatesObject[date.date] = {
        marked: true,
        dotColor: "#05a759",
      };
    });
    setMarkedDates(markedDatesObject);
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setSelectedDate(""); // Reset selected date when duration changes
    fetchAvailability(duration.id);
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString); // Store the selected date in YYYY-MM-DD format
  };

  const handleReservation = async (reservationType) => {
    if (!selectedDuration || !selectedDate) {
      Alert.alert("Incomplete Selection", "Please select duration and date.");
      return;
    }

    try {
      let endpoint = "";
      if (reservationType === "player") {
        endpoint = "/reservation/player";
      } else if (reservationType === "team") {
        endpoint = "/reservation/team";
      }

      console.log("LOG Sending player reservation request...");
      console.log(
        `LOG Request body: ${JSON.stringify({
          durationId: selectedDuration.id.toString(),
          date: selectedDate,
        })}`
      );

      const response = await axiosInstance.post(endpoint, {
        durationId: selectedDuration.id.toString(),
        date: selectedDate,
      });

      // Check if the response has a message and error to display
      if (response.data && response.data.message) {
        const { message, error } = response.data;
        if (error) {
          Alert.alert("Reservation Error", `${message}\n${error}`);
        } else {
          Alert.alert(`${reservationType} Reservation Success`, message);
        }
      } else {
        console.log(`${reservationType} Reservation Success:`, response.data);
        // Handle success scenario, navigate or show confirmation
      }
    } catch (error) {
      if (error.response) {
        console.error(
          `Error making ${reservationType} reservation:`,
          error.response.data
        );
        const { message, error: errorMsg } = error.response.data;
        Alert.alert("Reservation Error", ` ${message}`);
      } else if (error.request) {
        console.error(
          `Error making ${reservationType} reservation: No response received.`,
          error.request
        );
        Alert.alert(
          "Reservation Error",
          "No response received from server. Please check your internet connection and try again."
        );
      } else {
        console.error(
          `Error making ${reservationType} reservation:`,
          error.message
        );
        Alert.alert(
          "Reservation Error",
          `Failed to make reservation. Error: ${error.message}`
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.calendarContainer}>
          {showCalendar && (
            <>
              <Text style={styles.sectionTitle}>Select Date:</Text>
              <Calendar
                current={selectedDate}
                markedDates={markedDates}
                minDate={minDate}
                onDayPress={(day) => handleDateSelect(day)}
                monthFormat={"MMMM yyyy"}
                hideArrows={false}
                hideExtraDays={true}
                disableMonthChange={false}
                firstDay={1}
                hideDayNames={false}
                showWeekNumbers={false}
                onPressArrowLeft={(subtractMonth) =>
                  subtractMonth && subtractMonth()
                }
                onPressArrowRight={(addMonth) => addMonth && addMonth()}
                theme={{
                  textSectionTitleColor: "#b6c1cd",
                  selectedDayBackgroundColor: "#05a759",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#05a759",
                  dayTextColor: "#2d4150",
                  textDisabledColor: "#d9e1e8",
                  dotColor: "#05a759",
                  selectedDotColor: "#ffffff",
                  arrowColor: "#05a759",
                  monthTextColor: "#05a759",
                  indicatorColor: "#05a759",
                }}
                style={styles.calendarStyle}
              />
              {selectedDate ? (
                <Text style={styles.selectedDateText}>
                  Selected Date: {selectedDate}
                </Text>
              ) : null}
            </>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.playerButton]}
            onPress={() => handleReservation("player")}
            disabled={!selectedDuration || !selectedDate}
          >
            <Text style={styles.buttonText}>Reserve as Player</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.teamButton]}
            onPress={() => handleReservation("team")}
            disabled={!selectedDuration || !selectedDate}
          >
            <Text style={styles.buttonText}>Reserve as Team</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 10,
  },
  header: {
    backgroundColor: "#05a759",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  durationList: {
    maxHeight: 50,
    marginBottom: 20,
  },
  durationItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    textAlign: "center",
  },
  calendarContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    marginBottom: 20,
    padding: 20,
  },
  calendarStyle: {
    marginBottom: 10,
  },
  selectedDateText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playerButton: {
    backgroundColor: "#05a759",
    marginRight: 10,
  },
  teamButton: {
    backgroundColor: "#0e6ba8",
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReservationScreen;
