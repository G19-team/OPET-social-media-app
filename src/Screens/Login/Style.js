import { StyleSheet } from "react-native";

import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";
import { Colors } from "../../Assets/Colors/Colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topleftimg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  innercontainer: {
    marginTop: moderateScale(100),
  },
  top: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: scale(30),
    color: Colors.primaryColor500,
    fontWeight: "800",
  },
  lblinput: {
    marginHorizontal: moderateScale(30),
  },
  btn: {
    borderRadius: moderateScale(20),
    marginHorizontal: moderateVerticalScale(30),
    marginVertical: moderateVerticalScale(20),
    paddingVertical: moderateVerticalScale(10),
    backgroundColor: Colors.primaryColor500,
    borderWidth: 0,
    elevation: 5,
  },
  fontstyle: {
    fontSize: scale(16),
    fontWeight: "800",
    color: "#ffffff",
  },
  bottomimg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: -1,
  },
});
