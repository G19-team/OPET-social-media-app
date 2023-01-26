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
  btn: {
    elevation: 3,
    width: "85%",
    backgroundColor: Colors.primaryColor500,
    borderColor: Colors.primaryColor500,
    borderRadius: moderateScale(20),
    marginHorizontal: "auto",
    marginVertical: moderateVerticalScale(10),
    paddingVertical: moderateVerticalScale(8),
  },
  fontstyle: {
    fontSize: scale(14),
    textAlign: "center",
    fontWeight: "700",
    color: "#ffffff",
  },
  logocontainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: moderateVerticalScale(85),

  },
  logo: {
    width: moderateScale(125),
    height: moderateScale(125),
    justifyContent: "center",
    alignItems: "center",
  },
  logotext: {
    fontSize: scale(30),
    textShadowColor: Colors.primaryColor500,
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 1,
  },
  text: {
    textAlign: "center",
    fontSize: scale(14),
    marginHorizontal: moderateVerticalScale(40),
    marginVertical: moderateVerticalScale(30),
  },
  topleftimg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  bottomimg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: -1,
  },
  innercontainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
