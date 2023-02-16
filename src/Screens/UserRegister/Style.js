import { StyleSheet } from "react-native";

import { Colors } from "../../Assets/Colors/Colors";

import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#ffffff"
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    marginTop:moderateVerticalScale(30),
  },
  headingtext: {
    fontSize: scale(30),
    color: Colors.primaryColor500,
    fontWeight: "800",
  },
  picturecontainer: {
    marginVertical: moderateVerticalScale(20),
  },
  picture: {
    backgroundColor: Colors.primaryColor500,
    height: moderateScale(100),
    width: moderateScale(75),
    borderRadius: moderateScale(20),
  },
  picturebtn: {
    marginVertical: moderateVerticalScale(10),
    borderWidth: 2,
    borderColor: Colors.primaryColor200,
  },
  lblinput: {
    marginHorizontal: moderateScale(30),
  },
  name: {
    width: "48%",
  },
  twobox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: scale(16),
    fontWeight: "800",
    color: "#ffffff",
  },
});
