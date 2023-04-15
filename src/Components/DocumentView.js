import { StyleSheet, Text, View, Image } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

const DocumentView = ({ type, name, size }) => {
  const [docType, setDocType] = useState({
    type: "",
    path: null,
  });

  const docSize = (size / 1000000).toFixed(2);

  useLayoutEffect(() => {
    switch (type) {
      case "application/pdf":
        setDocType({
          type: "pdf",
          path: require("../Assets/Icons/Pdf-icon.png"),
          lightColor: "lightgray",
          darkColor: "#FF1700",
        });
        break;
      case "application/msword":
        setDocType({
          type: "doc",
          path: require("../Assets/Icons/Doc-icon.png"),
          lightColor: "lightgray",
          darkColor: "#2B3467",
        });
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        setDocType({
          type: "doc",
          path: require("../Assets/Icons/Doc-icon.png"),
          lightColor: "lightgray",
          darkColor: "#2B3467",
        });
        break;
      case "application/zip":
        setDocType({
          type: "zip",
          path: require("../Assets/Icons/Zip-icon.png"),
          lightColor: "lightgray",
          darkColor: "#FFB11F",
        });
        break;
      case "application/x-httpd-php":
        setDocType({
          type: "php",
          path: require("../Assets/Icons/Php-icon.png"),
          lightColor: "lightgray",
          darkColor: "#CFD2FC",
        });
        break;
      case "text/javascript":
        setDocType({
          type: "js",
          path: require("../Assets/Icons/Js-icon.png"),
          lightColor: "lightgray",
          darkColor: "#FFB11F",
        });
        break;
      case "text/html":
        setDocType({
          type: "js",
          path: require("../Assets/Icons/Html-icon.png"),
          lightColor: "lightgray",
          darkColor: "#FF694B",
        });
        break;
      case "text/css":
        setDocType({
          type: "js",
          path: require("../Assets/Icons/Css-icon.png"),
          lightColor: "lightgray",
          darkColor: "#6EAADC",
        });
        break;
      case "application/vnd.ms-powerpoint":
        setDocType({
          type: "js",
          path: require("../Assets/Icons/Ppt-icon.png"),
          lightColor: "lightgray",
          darkColor: "#FF1700",
        });
        break;
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        setDocType({
          type: "js",
          path: require("../Assets/Icons/Xml-icon.png"),
          lightColor: "lightgray",
          darkColor: "#F29C1F",
        });
        break;
      case "application/xml":
        setDocType({
          type: "js",
          path: require("../Assets/Icons/Xml-icon.png"),
          lightColor: "lightgray",
          darkColor: "#F29C1F",
        });
        break;
      default:
        console.log("none");
    }
  }, [type]);

  return (
    <View style={[styles.container, { backgroundColor: docType.darkColor }]}>
      <View style={[styles.header, { backgroundColor: docType.lightColor }]}>
        <Image source={docType.path} style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </View>
      {/* <View style={styles.footer}>
        {/* <Text style={styles.info}>
          {docSize} mb{"\t"}
        </Text> 
        <Text style={styles.info}>- {"\t" + docType.type}</Text>
      </View> */}
    </View>
  );
};

export default DocumentView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#89c2d9",
    borderRadius: moderateScale(10),
    width: "100%",
  },
  header: {
    margin: moderateScale(5),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#a9d6ee",
    borderRadius: moderateScale(5),
    paddingVertical: moderateVerticalScale(10),
    paddingRight: moderateScale(55),
    paddingHorizontal: moderateScale(5),
    overflow: "hidden",
  },
  icon: {
    height: moderateVerticalScale(42),
    width: moderateScale(42),
  },
  name: {
    fontSize: scale(12),
    marginLeft: moderateScale(5),
    textAlign: "left",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    marginVertical: moderateVerticalScale(3),
    marginHorizontal: moderateScale(1),
  },
  info: {
    fontSize: scale(12),
    fontWeight: "300",
  },
});
