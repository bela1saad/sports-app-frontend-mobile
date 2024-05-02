import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: "http://192.168.43.48:4000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Add a small delay to allow AsyncStorage to fully set the token
        setTimeout(async () => {
          const token = await AsyncStorage.getItem("token");
          console.log("Retrieved token from AsyncStorage:", token);

          if (token) {
            console.log("Token found. Adding to request headers.");
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            console.warn("Token not found in AsyncStorage");
          }

          resolve(config);
        }, 100); // Adjust the delay time as needed
      } catch (error) {
        console.error("Error loading token:", error);
        reject(error);
      }
    });
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
