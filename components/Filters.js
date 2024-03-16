import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

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
      {["All", "Team", "Player"].map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            selectedFilter === filter && styles.selectedFilter,
          ]}
          onPress={() => handleFilterSelect(filter)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === filter && styles.selectedText,
            ]}
          >
            {filter}
          </Text>
        </TouchableOpacity>
      ))}

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
              style={Platform.OS === "ios" ? { width: "100%" } : {}}
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
    borderRadius: width * 0.1,
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.03,
    backgroundColor: "#1a1a1a",
    elevation: 2,
    marginHorizontal: width * 0.03,
    marginTop: width * 0.03,
    width: "90%",
  },
  filterButton: {
    paddingHorizontal: width * 0.02,
    paddingVertical: width * 0.01,
    borderRadius: width * 0.05,
    marginHorizontal: width * 0.01,
    backgroundColor: "#333333",
  },
  filterButtonText: {
    color: "#555",
    fontSize: width * 0.035,
  },
  selectedText: {
    color: "#555",
  },
  selectedFilter: {
    backgroundColor: "#05a759",
    minWidth: width * 0.15,
    paddingHorizontal: width * 0.03,
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
  },
  sportsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Filters;
