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
  },
  lblinput: {
    marginHorizontal: moderateScale(30),
    marginVertical: moderateScale(5),
  },
  heading: {
    marginTop: moderateVerticalScale(30),
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  headingtext: {
    fontSize: scale(25),
    color: Colors.primaryColor500,
    fontWeight: "800",
  },
  picturecontainer: {
    marginVertical: moderateVerticalScale(20),
  },
  picture: {
    overflow: "hidden",
    borderRadius: moderateScale(100),
    backgroundColor: Colors.primaryColor500,
    height: moderateScale(120),
    width: moderateScale(120),
  },
  picturebtn: {
    marginVertical: moderateVerticalScale(10),
    borderWidth: 2,
    borderColor: Colors.primaryColor200,
  },
  info: {
    marginHorizontal: moderateScale(30),
    marginVertical: moderateVerticalScale(9),
    fontWeight: "bold",
    borderTopWidth: 0.3,
    paddingVertical: moderateScale(8),
    color: Colors.primaryColor200,
    // alignItems:"center"
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
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  error: {
    color: "red",
    marginBottom: 10,
    marginHorizontal: moderateScale(35),
  },
});
