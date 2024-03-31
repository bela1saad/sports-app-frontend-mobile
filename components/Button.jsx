import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from "react-native";
import COLORS from "../constants/colors";

const { width } = Dimensions.get("window");

const Button = (props) => {
  const filledBgColor = props.color || COLORS.primary;
  const outlinedColor = COLORS.white;
  const bgColor = props.filled ? filledBgColor : outlinedColor;
  const textColor = props.filled ? COLORS.white : COLORS.primary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          paddingVertical: width * 0.03,
          paddingHorizontal: width * 0.08,
        },
        props.style,
        Platform.OS === "android" ? { elevation: 2 } : styles.iosShadow,
      ]}
      onPress={props.onPress}
    >
      <Text
        style={[
          styles.buttonText,
          { color: textColor, fontSize: width * 0.04 },
          Platform.OS === "android" && styles.androidText,
        ]}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: width * 0.03,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  androidText: {
    fontWeight: "bold",
  },
  iosShadow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Button;
