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
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
  },

  top: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateScale(3),
  },
  heading: {
    fontSize: scale(30),
    color: Colors.primaryColor500,
    fontWeight: "800",
  },
  lblinput: {
    marginHorizontal: moderateScale(30),
    marginVertical: moderateScale(3),
  },
  btn: {
    borderRadius: moderateScale(20),
    marginHorizontal: moderateVerticalScale(30),
    marginVertical: moderateVerticalScale(15),
    paddingVertical: moderateVerticalScale(10),
    backgroundColor: Colors.primaryColor500,
    borderWidth: 0,
    elevation: 5,
  },
  fontstyle: {
    fontSize: scale(15),
    fontWeight: "800",
    color: "#ffffff",
  },
  bottomimg: {
    width: "100%",
    zIndex: -1,
  },
});
