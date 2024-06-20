import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axiosInstance from "../../utils/axios"; // Assuming you have an Axios instance configured
import { useAuth } from "../../auth/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const TransactionScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentPlayer } = useAuth(); // Get currentPlayer from AuthContext

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/transaction/by-user/${currentPlayer.user_id}`
      );
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions. Please try again later.");
      setLoading(false);
    }
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Icon
          name={
            item.status === "completed"
              ? "checkmark-circle"
              : "ellipsis-horizontal"
          }
          size={24}
          color={item.status === "completed" ? "#05a759" : "#FFD700"}
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionType}>Type: {item.type}</Text>
        <Text style={styles.transactionAmount}>
          Amount: ${parseFloat(item.amount).toFixed(2)}
        </Text>
        <Text style={styles.transactionStatus}>Status: {item.status}</Text>
        <Text style={styles.transactionCreatedAt}>
          Created At: {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#05a759" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1c1c1c",
    borderBottomWidth: 1,
    borderBottomColor: "#2c2c2c",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  transactionItem: {
    flexDirection: "row",
    backgroundColor: "#1c1c1c",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2c2c2c",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  transactionIcon: {
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 5,
  },
  transactionAmount: {
    color: "#05a759",
    fontSize: 16,
    marginBottom: 5,
  },
  transactionStatus: {
    color: "#FFD700",
    fontSize: 16,
    marginBottom: 5,
  },
  transactionCreatedAt: {
    color: "#888",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});

export default TransactionScreen;
