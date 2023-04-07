import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import FitImage from "react-native-fit-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../db/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import {
  moderateScale,
  scale,
  moderateVerticalScale,
} from "react-native-size-matters";

const AboutOrganization_Screen = () => {
  const [orgData, setOrgData] = useState({});
  useLayoutEffect(() => {
    const init = async () => {
      const id = await AsyncStorage.getItem("orgId").then(async (orgId) => {
        const ref = await getDoc(doc(db, "organization", orgId));
        setOrgData({
          id: ref.id,
          data: ref.data(),
        });
      });
    };
    init();
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {orgData.data && (
        <View Style={styles.outercontainer}>
          <View style={styles.imgcontainer}>
            <FitImage
              source={{ uri: orgData.data.Picture }}
              style={styles.img}
              resizeMode="contain"
            />
          </View>
          <View style={styles.content}>
            <Text style={styles.heading}>{orgData.data.Orgname}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.subheading}>Contact number: </Text>
            <Text style={styles.text}>
              {orgData.data.OrganizationContactNumber}
            </Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.subheading}>Email : </Text>
            <Text style={styles.text}>{orgData.data.OrganizationEmail}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.subheading}>About your organization: </Text>
            <Text style={styles.text}>{orgData.data.AboutOrganization}</Text>
          </View>
         ` <View style={styles.content}>
            <Text style={styles.subheading}>Address: </Text>
            <Text style={styles.text}>{orgData.data.Address}</Text>
          </View>`
        </View>
      )}
    </ScrollView>
  );
};

export default AboutOrganization_Screen;

const styles = StyleSheet.create({
  outercontainer: {
    padding: moderateVerticalScale(13),
    backgroundColor: "#ffffff",
    flex: 1,
  },
  imgcontainer: {
    marginVertical: moderateVerticalScale(5),
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: moderateScale(150),
    height: moderateVerticalScale(150),
    borderRadius: 200 / 2,
  },
  content: {
    borderWidth: 1,
    borderRadius: moderateScale(10),
    paddingVertical: moderateVerticalScale(13),
    paddingHorizontal: moderateScale(17),
    margin: moderateVerticalScale(13),
  },
  heading: {
    fontSize: scale(20),
    fontWeight: "bold",
    textAlign: "center",
  },
  subheading: {
    fontSize: scale(16),
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: moderateScale(15),
    textAlign: "justify",
    includeFontPadding: true,
    marginTop: moderateVerticalScale(4),
  },
});
