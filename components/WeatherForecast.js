import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions, // Import Dimensions from 'react-native'
} from "react-native";
import LottieView from "lottie-react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const WeatherForecast = ({ lat, lon, apiKey, bookingDate, bookingTime }) => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchWeatherData(lat, lon, apiKey, bookingDate, bookingTime);
  }, [lat, lon, apiKey, bookingDate, bookingTime]); // Re-fetch on changes

  const fetchWeatherData = async (
    lat,
    lon,
    apiKey,
    bookingDate,
    bookingTime
  ) => {
    try {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      // Optional: You can modify the API URL to include booking date and time for a more precise forecast.
      // Refer to OpenWeatherMap documentation for supported parameters: https://openweathermap.org/api/weather

      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log("Weather Data:", data); // Log the entire weather data object
      setWeatherData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setLoading(false); // Ensure loading state is updated even if there's an error
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#333333" />
        <Text style={styles.loadingText}>getting weather data...</Text>
      </View>
    );
  }

  if (
    !weatherData ||
    !weatherData.main ||
    !weatherData.weather ||
    weatherData.weather.length === 0
  ) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error getting weather data</Text>
      </View>
    );
  }

  const temperatureCelsius = Math.round(weatherData.main.temp - 273.15); // Convert temperature from Kelvin to Celsius
  const weatherDescription = weatherData.weather[0].description;
  const windSpeed = weatherData.wind.speed;
  const humidity = weatherData.main.humidity;
  const cityName = weatherData.name;
  const countryCode = weatherData.sys.country;
  return (
    <View style={styles.container}>
      <Text style={styles.weatherText}>Weather conditions</Text>
      <View style={styles.weatherDetails}>
        <LottieView
          source={getWeatherAnimation(weatherDescription)}
          autoPlay
          loop
          style={{ width: 75, height: 80 }}
        />
        <View style={styles.weatherInfo}>
          <View style={styles.extraInfo}>
            <Text style={styles.extraInfoText}>
              {" "}
              {cityName}, {countryCode}{" "}
            </Text>
          </View>

          <View style={styles.extraInfo}>
            <FontAwesome5 name="thermometer-half" size={20} color="#FFFFFF" />
            <Text style={styles.extraInfoText}> {temperatureCelsius}°C </Text>
          </View>
          <View style={styles.extraInfo}>
            <FontAwesome5 name="wind" size={20} color="#FFFFFF" />
            <Text style={styles.extraInfoText}> Wind: {windSpeed} m/s </Text>
          </View>
          <View style={styles.extraInfo}>
            <FontAwesome5 name="tint" size={20} color="#FFFFFF" />
            <Text style={styles.extraInfoText}> Humidity: {humidity}% </Text>
          </View>
          <View style={styles.extraInfo}>
            <FontAwesome5 name="cloud" size={20} color="#FFFFFF" />
            <Text style={styles.extraInfoText}>
              {" "}
              Condition: {weatherDescription}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const getWeatherAnimation = (description) => {
  // Your logic to map weather descriptions to Lottie animations
  // Example logic:
  switch (description.toLowerCase()) {
    case "clear sky":
      return require("../assets/weather/Animation - sun.json"); // Lottie animation for clear weather
    case "clouds":
      return require("../assets/weather/Animation - pcludy.json"); // Lottie animation for cloudy weather
    case "rain":
      return require("../assets/weather/Animation - rainny.json"); // Lottie animation for rainy weather
    case "snow":
      return require("../assets/weather/Animation - snow.json"); // Lottie animation for snowy weather
    default:
      return require("../assets/weather/Animation - mist.json"); // Default Lottie animation
  }
};

// Get the window width
const { width } = Dimensions.get("window");

// Calculate the font size based on the window width
const fontSize = width < 400 ? 14 : 16;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 10,
    fontSize: fontSize,
    color: "#333333",
  },
  weatherText: {
    fontSize: fontSize + 2, // Increase font size for weather text
    fontWeight: "bold",
    marginBottom: 10,
    color: "#05a759",
  },
  weatherDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherInfo: {
    marginLeft: 10,
  },
  weatherInfoText: {
    fontSize: fontSize,
  },
  extraInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  extraInfoText: {
    fontSize: fontSize,
    color: "#BDBDBD",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: fontSize,
    color: "red",
  },
});

export default WeatherForecast;
