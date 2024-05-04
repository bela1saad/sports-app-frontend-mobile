import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: "http://192.168.43.48:4000/api",
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Add token to request headers
        config.headers.Authorization = "Bearer " + token;
        console.log("Token found. Adding to request headers.");
      } else {
        console.warn("Token not found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error loading token:", error);
    }

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
