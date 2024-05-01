import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.43.48:4000/api", // Replace with your backend URL
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

export default instance;
