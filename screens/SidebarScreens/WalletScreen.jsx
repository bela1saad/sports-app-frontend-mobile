import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axiosInstance from "../../utils/axios";
import {
  StripeProvider,
  useStripe,
  usePaymentSheet,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

// Configuration (replace with your actual values)
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY; // Replace with your actual Stripe publishable key

const WalletScreen = () => {
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const { confirmPayment, loading: paymentLoading } = useConfirmPayment();
  const navigation = useNavigation();

  // Hide header on this screen
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Fetch wallet balance on component mount
  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/wallet/balance`);
      setWalletBalance(response.data.wallet.balance);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setError("Failed to fetch wallet balance. Please try again later.");
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!amount) {
      Alert.alert("Error", "Please enter an amount.");
      return;
    }

    if (parseFloat(amount) > 1000) {
      Alert.alert("Error", "The maximum amount allowed is $1000.");
      return;
    }
    try {
      setLoading(true);

      // Step 1: Initiate payment to get clientSecret
      console.log("Initiating payment...");
      const initiateResponse = await axiosInstance.post(
        `/stripe/initiate-payment/`,
        {
          amount: (parseFloat(amount) * 100).toString(), // Convert amount to cents
        }
      );

      const { clientSecret } = initiateResponse.data;
      console.log("Client secret received:", clientSecret);

      // Step 2: Initialize the PaymentSheet
      console.log("Initializing PaymentSheet...");
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        returnURL: "http://192.168.43.48:4000/api/stripe/confirm-payment", // Replace with your actual return URL
      });

      if (initError) {
        throw new Error(initError.message);
      }
      console.log("PaymentSheet initialized successfully.");

      // Step 3: Present the PaymentSheet
      console.log("Presenting PaymentSheet...");
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        throw new Error(presentError.message);
      }
      console.log("PaymentSheet presented successfully.");

      // Step 4: Confirm the payment and update wallet balance
      console.log("Confirming payment...");
      const paymentIntent = await stripe.confirmPayment(clientSecret);

      // Check if the paymentIntent status allows confirmation
      if (paymentIntent.status === "succeeded") {
        throw new Error("PaymentIntent already succeeded");
      }

      console.log("Payment confirmed:", paymentIntent);

      // Extract paymentIntentId from clientSecret
      const paymentIntentId = clientSecret.split("_secret_")[0];

      console.log("PaymentIntent ID:", paymentIntentId);

      // Step 5: Send confirmation request to your backend
      console.log("Sending confirmation request to backend...");
      const confirmResponse = await axiosInstance.post(
        `/stripe/confirm-payment/`,
        {
          paymentIntentId: paymentIntentId,
          amount: amount,
        }
      );

      console.log("Confirmation request sent:", confirmResponse.data);

      // Update wallet balance after successful payment
      fetchWalletBalance();

      Alert.alert("Success", "Funds added to wallet successfully!");
      setAmount("");
    } catch (error) {
      console.error("Error adding money to wallet:", error);

      if (error.response) {
        // Server responded with an error status code (4xx or 5xx)
        console.error("Server error:", error.response.data);
        Alert.alert(
          "Error",
          "Failed to add money to wallet. Please try again later."
        );
      } else {
        // Network error or other unexpected errors
        console.error("Network error or unexpected error:", error.message);
        Alert.alert(
          "Error",
          "Failed to communicate with the server. Please check your network connection."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StripeProvider publishableKey={stripePublishableKey}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.content}>
              <Text style={styles.title}>Wallet</Text>
              {walletBalance !== null && !loading && !error && (
                <View style={styles.balanceCard}>
                  <Text style={styles.balanceText}>
                    Wallet Balance: ${parseFloat(walletBalance).toFixed(2)}
                  </Text>
                </View>
              )}
              {loading && <ActivityIndicator size="large" color="#05a759" />}
              {error && <Text style={styles.errorText}>{error}</Text>}
              <Text style={styles.limitText}>
                The maximum amount allowed is $1000.
              </Text>
              <TextInput
                placeholder="Enter amount in $"
                keyboardType="numeric"
                value={amount}
                placeholderTextColor="#9E9E9E"
                onChangeText={setAmount}
                style={styles.input}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={handleAddMoney}
                disabled={loading || !amount}
                style={[
                  styles.button,
                  (loading || !amount) && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.buttonText}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#101010",
  },
  container: {
    flex: 1,
    backgroundColor: "#101010",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  content: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  balanceCard: {
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2c2c2c",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  balanceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#05a759",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  limitText: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    marginVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#2c2c2c",
    color: "#fff",
  },
  button: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#05a759",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WalletScreen;
