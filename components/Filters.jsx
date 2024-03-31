import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";

const { width, height } = Dimensions.get("window");

const sportsContent = [
  "All",
  "Football",
  "Basketball",
  "Tennis",
  "Cricket",
  "Other",
];

const Filters = ({
  selectedFilter,
  setSelectedFilter,
  selectedSport,
  setSelectedSport,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleFilterSelect = (filter) => {
    if (filter === "All") {
      setSelectedFilter("All");
      setSelectedSport("All");
    } else {
      setSelectedFilter(filter);
    }
    setShowModal(false);
  };

  const handleSportSelect = (sport) => {
    setSelectedSport(sport);
    setSelectedFilter("Sports");
    setShowModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        key="All"
        style={[
          styles.filterButton,
          selectedFilter === "All" && styles.selectedFilter,
        ]}
        onPress={() => handleFilterSelect("All")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedFilter === "All" && styles.selectedText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedFilter === "Sports" && styles.selectedFilter,
          styles.sportsButton,
        ]}
        onPress={toggleModal}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedFilter === "Sports" && styles.selectedText,
          ]}
        >
          {selectedSport === "All" ? "Sports" : selectedSport}
        </Text>
        <Icon
          name="caret-down"
          size={width * 0.04}
          color={selectedFilter === "Sports" ? "#555" : "transparent"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        key="Team"
        style={[
          styles.filterButton,
          selectedFilter === "Team" && styles.selectedFilter,
        ]}
        onPress={() => handleFilterSelect("Team")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedFilter === "Team" && styles.selectedText,
          ]}
        >
          Team
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        key="Player"
        style={[
          styles.filterButton,
          selectedFilter === "Player" && styles.selectedFilter,
        ]}
        onPress={() => handleFilterSelect("Player")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedFilter === "Player" && styles.selectedText,
          ]}
        >
          Player
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={selectedSport}
              onValueChange={(itemValue) => handleSportSelect(itemValue)}
            >
              {sportsContent.map((sport) => (
                <Picker.Item label={sport} value={sport} key={sport} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: width * 0.08,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    backgroundColor: "#1a1a1a",
    elevation: 2,
    marginHorizontal: width * 0.03,
    marginTop: height * 0.02,
    width: "90%",
  },
  filterButton: {
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.04,
    marginHorizontal: width * 0.01,
    backgroundColor: "#333333",
  },
  filterButtonText: {
    color: "#555",
    fontSize: Math.min(width, height) * 0.035,
  },
  selectedText: {
    color: "#555",
  },
  selectedFilter: {
    backgroundColor: "#05a759",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: width * 0.05,
    padding: width * 0.04,
    minWidth: width * 0.5,
    minHeight: height * 0.3,
  },
  sportsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Filters;
