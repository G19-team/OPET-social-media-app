import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

import Ionicons from "@expo/vector-icons/Ionicons";

import React from "react";
import { Colors } from "../Assets/Colors/Colors";

import { ActivityIndicator } from "react-native-paper";

function MyButton({
  title,
  onPress,
  style,
  fontStyle,
  isIcon,
  iconName,
  iconSize,
  iconColor,
  isLoading,
  disabled,
  ...props
}) {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, style]}
      onPress={onPress}
      {...props}
    >
      <View style={styles.innercontainer}>
        {isLoading ? (
          <ActivityIndicator size={"small"} color={"#ffffff"} />
        ) : (
          <>
            <Text
              name="title"
              style={[
                styles.title,
                fontStyle,
                (isIcon === "true" || iconName) && {
                  marginRight: moderateScale(7),
                },
              ]}
            >
              {title || title != null ? title : "Press me !"}
            </Text>
            {isIcon === "true" ||
              (iconName && (
                <Ionicons
                  name={iconName ? iconName : "arrow-forward"}
                  size={iconSize ? iconSize : moderateScale(23)}
                  color={iconColor ? iconColor : "black"}
                />
              ))}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default MyButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.primaryColor50,
    borderRadius: moderateScale(10),
    margin: moderateVerticalScale(5),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateVerticalScale(5),
    backgroundColor: "#ffffff",
  },
  innercontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#000000",
    fontWeight: "600",
    fontSize: scale(14),
  },
});
