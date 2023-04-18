import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import * as OpenAnything from "react-native-openanything";
import React, { useLayoutEffect, useState } from "react";
import FitImage from "react-native-fit-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../db/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { Colors } from "../../Assets/Colors/Colors";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
        const ref = doc(db, "organization", orgId);
        const unsubscribe = onSnapshot(ref, (data) => {
          setOrgData({
            id: data.id,
            data: data.data(),
          });
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
            <Image
              source={{ uri: orgData.data.Picture }}
              style={styles.img}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.name}>{orgData.data.Orgname}</Text>
            </View>
          </View>
          <View style={styles.innercontainer}>
            <View style={styles.content}>
              <Text style={styles.subheading}>About your organization</Text>
            </View>
            <View style={styles.aboutorg}>
              <Text style={styles.text}>{orgData.data.AboutOrganization}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.subheading}>Contact your organization</Text>
            </View>

            <TouchableOpacity
              style={styles.contactorgcontainer}
              onPress={() => {
                OpenAnything.Call("+91 9898374059")
                  .then(() => {
                    console.log("Phone call initiated successfully");
                  })
                  .catch((error) => {
                    console.log("Error initiating phone call:", error);
                  });
              }}
            >
              <View style={styles.options}>
                <View style={styles.content}>
                  <Text style={styles.contactorg}>Phone number: </Text>
                  <Text style={styles.text}>
                    {orgData.data.OrganizationContactNumber}
                  </Text>
                </View>
                <Icon
                  name="arrow-right"
                  size={moderateScale(25)}
                  color={Colors.primaryColor50}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactorgcontainer}
              onPress={() =>
                OpenAnything.Email((to = orgData.data.OrganizationEmail))
              }
            >
              <View style={styles.options}>
                <View style={styles.content}>
                  <Text style={styles.contactorg}>Email : </Text>
                  <Text style={styles.text}>
                    {orgData.data.OrganizationEmail}
                  </Text>
                </View>
                <Icon
                  name="arrow-right"
                  size={moderateScale(25)}
                  color={Colors.primaryColor50}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.content}>
              <Text style={styles.subheading}>Address</Text>
            </View>
            <View style={styles.aboutorg}>
              <Text style={styles.text}>{orgData.data.Address}</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default AboutOrganization_Screen;

const styles = StyleSheet.create({
  outercontainer: {
    flex: 1,
  },
  innercontainer: {
    backgroundColor: "#ffffff",
    paddingVertical: moderateVerticalScale(20),
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
  },
  imgcontainer: {
    paddingVertical: moderateVerticalScale(20),
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    margin: moderateScale(8),
    width: moderateScale(120),
    height: moderateVerticalScale(120),
    borderRadius: 150 / 2,
  },
  name: {
    color: "#ffffff",
    fontSize: scale(25),
    fontWeight: "bold",
    textAlign: "center",
  },
  aboutorg: {
    borderWidth: 1,
    borderRadius: moderateScale(18),
    paddingVertical: moderateVerticalScale(20),
    paddingHorizontal: moderateScale(20),
    marginHorizontal: moderateVerticalScale(14),
    marginVertical: moderateVerticalScale(7),
    borderRadius: moderateScale(20),
  },
  content: {
    paddingVertical: moderateVerticalScale(20),
  },
  contactorgcontainer: {
    borderWidth: 1,
    borderRadius: moderateScale(18),
    backgroundColor: "#fefefe",
    marginHorizontal: moderateVerticalScale(14),
    marginVertical: moderateVerticalScale(7),
  },
  contactorg: {
    textAlign: "left",
    fontSize: moderateScale(15),
    fontWeight: "bold",
  },
  options: {
    paddingHorizontal: moderateScale(20),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
