import React from "react";
import Flag from "react-native-flags";

const CountryFlagSwiper = ({ location }) => {
  // Extract country codes from location string (assuming comma-separated)
  const countryCodes = location
    .split(",")
    .map((code) => code.trim().toLowerCase());

  return (
    <View style={styles.flagContainer}>
      {countryCodes.map((code) => (
        <Flag key={code} countryCode={code} style={styles.flag} size={24} /> // Adjust size as needed
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  flagContainer: {
    flexDirection: "row",
    alignItems: "center", // Center flags vertically
  },
  flag: {
    marginRight: 5, // Adjust spacing between flags
  },
});

export default CountryFlagSwiper;
