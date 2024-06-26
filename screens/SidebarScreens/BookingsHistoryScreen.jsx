import React, { useState, useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import axiosInstance from "../../utils/axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../auth/AuthContext";
import { RadioButton } from "react-native-paper";

const BookingsHistoryScreen = () => {
  const [bookings, setBookings] = useState([]);
  const navigation = useNavigation();
  const [incompleteBookings, setIncompleteBookings] = useState([]);
  const [completeBookings, setCompleteBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("needPlayer");
  const { currentPlayer } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const fetchBookings = () => {
        setLoading(true);
        axiosInstance
          .get(`/reservation/by-user/${currentPlayer.id}`)
          .then((response) => {
            const fetchedBookings = response.data;
            setBookings(fetchedBookings);

            const incomplete = fetchedBookings.filter(
              (booking) => booking.status === "incomplete"
            );
            const complete = fetchedBookings.filter(
              (booking) => booking.status === "complete"
            );

            setIncompleteBookings(
              incomplete.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )
            );
            setCompleteBookings(
              complete.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )
            );
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching bookings:", error);
            setLoading(false);
          });
      };

      fetchBookings();
    }, [currentPlayer.id])
  );

  const handleCreatePost = () => {
    axiosInstance
      .post(`/posts/add`, {
        playerId: currentPlayer.id,
        reservationId: selectedReservationId,
        type: postType,
        content: postContent,
      })
      .then((response) => {
        Alert.alert("Post Created", "Your post has been created successfully!");
        setModalVisible(false);
        setPostContent("");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        const errorMessage =
          error.response?.data?.message ||
          "There was an error creating your post.";
        Alert.alert("Error", errorMessage);
      });
  };

  console.log("selectedReservationId", selectedReservationId);

  const handleRefund = () => {
    axiosInstance
      .post(`/reservation/refund/${selectedReservationId}`)
      .then((response) => {
        Alert.alert(
          "Refund Processed",
          `Amount refunded: ${response.data.amountRefunded}`
        );
        setRefundModalVisible(false);
        setBookings(
          bookings.map((booking) =>
            booking.id === selectedReservationId
              ? { ...booking, status: "refunded" }
              : booking
          )
        );
      })
      .catch((error) => {
        console.error("Error processing refund:", error);
        const errorMessage =
          error.response?.data?.message ||
          "There was an error processing the refund.";
        Alert.alert("Error", errorMessage);
      });
  };

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <MaterialIcons name="event" size={24} color="#05a759" />
      <View style={styles.bookingDetails}>
        <Text style={styles.bookingText}>Type: {item.type}</Text>
        <Text style={styles.bookingText}>Date: {item.date}</Text>
        <Text style={styles.bookingText}>Status: {item.status}</Text>
        <Text style={styles.bookingText}>
          Created At: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        {item.status === "incomplete" && (
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => {
              setSelectedReservationId(item.id);
              setModalVisible(true);
            }}
          >
            <Text style={styles.postButtonText}>Create Post</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.refundButton}
          onPress={() => {
            setSelectedReservationId(item.id);
            setRefundModalVisible(true);
          }}
        >
          <Text style={styles.refundButtonText}>Refund</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#05a759" />
      ) : (
        <>
          <Text style={styles.sectionTitle}>Incomplete Bookings</Text>
          <FlatList
            data={incompleteBookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
          />
          <Text style={styles.sectionTitle}>Complete Bookings</Text>
          <FlatList
            data={completeBookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
          />
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalView}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Post Content"
                placeholderTextColor="#aaa"
                value={postContent}
                onChangeText={setPostContent}
                multiline={true}
                numberOfLines={4}
                blurOnSubmit={Platform.OS === "ios"}
                onSubmitEditing={dismissKeyboard}
              />
              <Text style={styles.radioButtonLabel}>Select Post Type</Text>
              <View style={styles.radioButtonGroup}>
                <RadioButton.Group
                  onValueChange={(newValue) => setPostType(newValue)}
                  value={postType}
                >
                  <View style={styles.radioButtonItem}>
                    <RadioButton value="needPlayer" />
                    <Text style={styles.radioButtonText}>Need Player</Text>
                  </View>
                  <View style={styles.radioButtonItem}>
                    <RadioButton value="needEnemyTeam" />
                    <Text style={styles.radioButtonText}>Need Enemy Team</Text>
                  </View>
                </RadioButton.Group>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCreate]}
                  onPress={handleCreatePost}
                >
                  <Text style={styles.textStyle}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={refundModalVisible}
        onRequestClose={() => {
          setRefundModalVisible(!refundModalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.modalView}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Refund</Text>
              <Text style={styles.confirmText}>
                Are you sure you want to refund this reservation?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setRefundModalVisible(!refundModalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.buttonCreate]}
                  onPress={handleRefund}
                >
                  <Text style={styles.textStyle}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#101010",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#05a759",
    textAlign: "center",
  },
  list: {
    marginBottom: 20,
  },
  bookingItem: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  bookingDetails: {
    marginLeft: 15,
    flex: 1,
  },
  bookingText: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: "column", // Change from "row" to "column"
    alignItems: "flex-start", // Optional: Adjust alignment to your preference
    marginTop: 10, // Optional: Add margin to create space between buttons
  },
  postButton: {
    backgroundColor: "#05a759",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 10,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  refundButton: {
    backgroundColor: "#d9534f",
    padding: 10,
    borderRadius: 5,
  },
  refundButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#05a759",
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#05a759",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    marginBottom: 20,
    backgroundColor: "#2c2c2c",
  },
  confirmText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  radioButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#05a759",
    marginBottom: 10,
  },
  radioButtonGroup: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  radioButtonItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#d9534f",
    flex: 1,
    marginRight: 10,
  },
  buttonCreate: {
    backgroundColor: "#5cb85c",
    flex: 1,
  },
  textStyle: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default BookingsHistoryScreen;
