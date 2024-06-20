import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axiosInstance from "../utils/axios";
import { Picker } from "@react-native-picker/picker";

const FieldsScreen = ({ route }) => {
  const { profileData } = route.params;
  const navigation = useNavigation();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [showSportPicker, setShowSportPicker] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchSports = async () => {
    try {
      const response = await axiosInstance.get("/sport/all");
      setSports(response.data);
    } catch (error) {
      console.error("Error fetching sports:", error);
      Alert.alert("Error", "Failed to fetch sports. Please try again later.");
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/field/by-club/?clubId=${profileData.id}`
      );
      setFields(response.data);
    } catch (error) {
      console.error("Error fetching fields:", error);
      Alert.alert("Error", "Failed to fetch fields. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFields();
    }, [profileData])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFields().finally(() => setRefreshing(false));
  };

  const handleFieldPress = (item) => {
    navigation.navigate("Reservation", { fieldId: item.id });
  };

  const applyFilters = () => {
    return fields.filter((field) => {
      const matchesSport = selectedSport
        ? field.sport_id === parseInt(selectedSport)
        : true;
      const matchesSize = sizeFilter
        ? field.size === parseInt(sizeFilter)
        : true;
      return matchesSport && matchesSize;
    });
  };

  const renderField = ({ item }) => (
    <TouchableOpacity
      style={styles.fieldCard}
      onPress={() => handleFieldPress(item)}
    >
      <Image
        source={{
          uri: item.pic || "https://via.placeholder.com/80x80?text=No+Image",
        }}
        style={styles.fieldImage}
      />
      <View style={styles.fieldCardContent}>
        <Text style={styles.fieldDescription}>{item.description}</Text>
        <View style={styles.fieldInfoRow}>
          <Icon name="tag" size={14} color="#05a759" />
          <Text style={styles.fieldInfo}>Type: {item.type}</Text>
        </View>
        <View style={styles.fieldInfoRow}>
          <Icon name="futbol-o" size={14} color="#05a759" />
          <Text style={styles.fieldInfo}>
            Sport:{" "}
            {sports.find((sport) => sport.id === item.sport_id)?.name || "N/A"}
          </Text>
        </View>
        <View style={styles.fieldInfoRow}>
          <Icon name="arrows-alt" size={14} color="#05a759" />
          <Text style={styles.fieldInfo}>Size: {item.size}</Text>
        </View>
        <View style={styles.fieldInfoRow}>
          <Icon name="clock-o" size={14} color="#05a759" />
          <Text style={styles.fieldInfo}>Duration: {item.duration} hours</Text>
        </View>
        <View style={styles.fieldInfoRow}>
          <Icon name="dollar" size={14} color="#05a759" />
          <Text style={styles.fieldInfo}>Price: ${item.price}</Text>
        </View>
        <Text
          style={
            item.isUnderMaintenance
              ? styles.maintenanceText
              : styles.availableText
          }
        >
          {item.isUnderMaintenance
            ? `Under Maintenance\n${item.start_date} - ${item.end_date}`
            : "Available"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleSelectSport = (itemValue) => {
    setSelectedSport(itemValue);
    setShowSportPicker(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fields</Text>
      </View>
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          onPress={() => setShowSportPicker(true)}
          style={styles.pickerButton}
        >
          <Text style={styles.pickerButtonText}>
            {selectedSport
              ? sports.find((sport) => sport.id === parseInt(selectedSport))
                  .name
              : "Select Sport"}
          </Text>
        </TouchableOpacity>
        <TextInput
          style={styles.sizeInput}
          placeholder="Size"
          placeholderTextColor="#888"
          value={sizeFilter}
          onChangeText={setSizeFilter}
          keyboardType="numeric"
        />
      </View>
      <Modal
        visible={showSportPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSportPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Sport</Text>
            <Picker
              selectedValue={selectedSport}
              onValueChange={handleSelectSport}
            >
              <Picker.Item label="Select Sport" value="" />
              {sports.map((sport) => (
                <Picker.Item
                  label={sport.name}
                  value={sport.id.toString()}
                  key={sport.id}
                />
              ))}
            </Picker>
            <Button
              title="Close"
              onPress={() => setShowSportPicker(false)}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#05a759" />
        </View>
      ) : (
        <FlatList
          data={applyFilters()}
          renderItem={renderField}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContainer}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>No fields available</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  header: {
    backgroundColor: "#05a759",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  pickerButton: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#05a759",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
    marginRight: 10,
  },
  pickerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  sizeInput: {
    height: 50,
    borderColor: "#05a759",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    backgroundColor: "#1e1e1e",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: "#05a759",
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  flatListContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  fieldCard: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    marginVertical: 8,
    padding: 10,
    elevation: 2,
  },
  fieldImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  fieldCardContent: {
    flex: 1,
  },
  fieldDescription: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  fieldInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  fieldInfo: {
    fontSize: 14,
    color: "#d3d3d3",
    marginLeft: 5,
  },
  maintenanceText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  availableText: {
    color: "green",
    fontSize: 12,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default FieldsScreen;
