import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (type == "application/pdf") {
      setDocType({
        type: "pdf",
        path: require("../Assets/Icons/Pdf-icon.png"),
      });
    } else if (
      type == "application/msword" ||
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setDocType({
        type: "doc",
        path: require("../Assets/Icons/Doc-icon.png"),
      });
    } else {
      setDocType(null);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={docType.path} style={styles.icon} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.info}>
          {docSize} mb{"\t"}
        </Text>
        <Text style={styles.info}>- {"\t" + docType.type}</Text>
      </View>
    </View>
  );
};

export default DocumentView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#89c2d9",
    borderRadius: moderateScale(10),
    marginHorizontal: moderateScale(5),
  },
  header: {
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
