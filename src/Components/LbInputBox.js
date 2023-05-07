import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

import Ionicons from "@expo/vector-icons/Ionicons";

import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

const LbInputBox = ({
  lable,
  iconName,
  iconSize,
  iconColor,
  style,
  outstyle,
  textStyle,
  indicator,
  ...props
}) => {
  return (
    <View style={[styles.inputbox, outstyle]}>
      <Text style={styles.lable}>{lable ? lable : "Lable"}</Text>
      <View style={[styles.inputcontainer, style]}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={iconSize ? iconSize : 20}
            color={iconColor ? iconColor : "#000000"}
          />
        )}
        <TextInput
          style={[
            styles.input,
            iconName && { marginLeft: moderateScale(10) },
            textStyle,
          ]}
          {...props}
        />
      </View>
    </View>
  );
};

export default LbInputBox;

const styles = StyleSheet.create({
  inputbox: {
    marginVertical: moderateScale(8),
  },
  lable: {
    opacity: 0.5,
    fontSize: scale(14),
  },
  inputcontainer: {
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    elevation: 5,
    borderRadius: moderateScale(13),
    marginVertical: moderateScale(5),
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(10),
    flexDirection: "row",
  },
  input: {
    backgroundColor: "#f9f9f9",
    fontSize: scale(17),
    flex: 1,
  },
});
