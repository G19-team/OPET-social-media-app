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
    paddingHorizontal: moderateScale(20),
    backgroundColor: Colors.primaryColor10,
  },
  preview: {
    borderWidth:2,
    borderColor:"black",
    backgroundColor: "lightgray",
    marginBottom:moderateVerticalScale(10),
  },
  subheading: {
    fontSize: moderateScale(15),
    marginVertical: moderateVerticalScale(10),
    fontWeight:"500"
  },
  selectionbox: {
    marginBottom: moderateVerticalScale(15),
    overflow:"hidden",
    // borderRadius: moderateScale(20),
    borderColor: Colors.primaryColor50,
    // borderWidth: 0.5,
    borderBottomWidth:0.5
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateVerticalScale(8),
    paddingHorizontal: moderateVerticalScale(5),
  },
  icon: {
    height: moderateVerticalScale(43),
    width: moderateScale(43),
  },
  boxtext: {
    margin: moderateScale(15),
    color:Colors.primaryColor50,
    fontWeight:"400",

  },
  captioncontainer: {
    marginBottom: moderateVerticalScale(10),
  },
  caption: {
    opacity:0.8,
    fontSize:scale(14),
    borderWidth: 0.5,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateVerticalScale(3),
    
  },
  btn:{
    borderWidth:0,
    marginVertical:moderateVerticalScale(15),
    paddingVertical:moderateVerticalScale(10),
    backgroundColor:Colors.primaryColor500,
  },
  fontstyle:{
    color:Colors.primaryColor10,
    fontWeight:"900"
  }
});
