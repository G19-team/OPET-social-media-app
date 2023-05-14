import React, { useLayoutEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, Share } from "react-native";
import { Button } from "react-native-paper";

import Profile_Screen from "../Screens/Profile/Profile_Screen";
import AboutOrganization_Screen from "../Screens/AboutOrganization/AboutOrganization_Screen";
import TermsAndCondition_Screen from "../Screens/TermsAndCondition/TermsAndCondition_Screen";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { scale, moderateScale } from "react-native-size-matters";

import { signOut } from "firebase/auth";
import { auth, db } from "../db/firebaseConfig";

import { Colors } from "../Assets/Colors/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import alert from "../Utills/alert";
import { doc, onSnapshot } from "firebase/firestore";

const DrawerNav = ({ navigation }) => {
  const [downloadLink, setDownloadLink] = useState("");
  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, "opet_information", "link"), (doc) => {
      let data = doc.data();
      setDownloadLink(data.link);
    });
  }, []);

  const Drawer = createDrawerNavigator();
  const logOut = () => {
    signOut(auth)
      .then(() => {
        AsyncStorage.removeItem("orgId");
        AsyncStorage.removeItem("usrName");
        AsyncStorage.removeItem("password");
        navigation.replace("Start_Screen");
      })
      .catch((error) => {
        alert("Error!", error);
      });
  };
  return (
    <Drawer.Navigator
      initialRouteName="Profile_Screen"
      screenOptions={{
        ActiveTintColor: Colors.primaryColor50,
        headerTitleStyle: {
          fontFamily: "BubblegumSans-Regular",
          fontSize: scale(23),
          color: Colors.primaryColor10,
        },
        headerStyle: {
          borderBottomLeftRadius: moderateScale(25),
          borderBottomRightRadius: moderateScale(25),
          backgroundColor: Colors.primaryColor500,
        },
        headerShadowVisible: false,
        headerTintColor: "#ffffff",
        sceneContainerStyle: { backgroundColor: "#ffffff" },
        drawerActiveBackgroundColor: Colors.primaryColor500,
        drawerActiveTintColor: "#ffffff",
        drawerStyle: { paddingVertical: 10 },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Your profile"
        component={Profile_Screen}
        options={{
          drawerIcon: ({ size, color }) => {
            return <Icon name="account" color={color} size={size} />;
          },
        }}
      />
      <Drawer.Screen
        name="About organization"
        component={AboutOrganization_Screen}
        options={{
          drawerIcon: ({ size, color }) => {
            return <Icon name="office-building" color={color} size={size} />;
          },
          sceneContainerStyle: { backgroundColor: Colors.primaryColor500 },
        }}
      />
      <Drawer.Screen
        name="Terms and conditions"
        component={TermsAndCondition_Screen}
        options={{
          drawerIcon: ({ size, color }) => {
            return <Icon name="file-alert-outline" color={color} size={size} />;
          },
        }}
      />
    </Drawer.Navigator>
  );

  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Share OPET"
          icon={({ size, color }) => {
            return (
              <Icon name="share-variant-outline" color={color} size={size} />
            );
          }}
          onPress={async () => {
            try {
              const result = await Share.share({
                message:
                  "Discover OPET - the professional social media app for office use. Connect and collaborate seamlessly with colleagues.\n\nDownload now: " +
                  downloadLink,
              });
              if (result.action === Share.sharedAction) {
                if (result.activityType) {
                  // shared with activity type of result.activityType
                } else {
                  // shared
                }
              } else if (result.action === Share.dismissedAction) {
                // dismissed
              }
            } catch (error) {
              alert(error.message);
            }
          }}
        />

        <Button
          mode="contained"
          style={{
            backgroundColor: "red",
            marginVertical: 20,
            marginHorizontal: 40,
          }}
          onPress={() =>
            alert("Logout", "Are you sure you want to Logout?", [
              { text: "Yes", style: "default", onPress: () => logOut() },
              { text: "No", style: "cancel" },
            ])
          }
        >
          Log out
        </Button>
      </DrawerContentScrollView>
    );
  }
};

export default DrawerNav;
