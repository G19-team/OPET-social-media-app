import React from "react";

import { StatusBar } from "react-native";

//All tab navigation screens
import Home_Screen from "../Screens/Home/Home_Screen";
import UploadPost_Screen from "../Screens/UploadPost/UploadPost_Screen";
import EmployeeList_Screen from "../Screens/EmployeeList/EmployeeList_Screen";
import Profile_Screen from "../Screens/Profile/Profile_Screen";


//Icon library
import Ionicons from "@expo/vector-icons/Ionicons";

//font library
import { useFonts } from "expo-font";

//libray for tab navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//custome colors
import { Colors } from "../Assets/Colors/Colors";

//responsive library
import { moderateScale, scale } from "react-native-size-matters";

const HomeNav = () => {
  const Tab = createBottomTabNavigator();

  const [fontLoaded] = useFonts({
    "BubblegumSans-Regular": require("../Assets/Fonts/BubblegumSans-Regular.ttf"),
  });

  if (!fontLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryColor500} />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.primaryColor50,
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
          tabBarStyle: {
            height: moderateScale(50),
            elevation: 0,
            borderTopWidth:1,
            borderTopColor:"#252525",
          },
          headerShadowVisible: false,
        
        }}
      >
        <Tab.Screen
          name="Home_Screen"
          component={Home_Screen}
          options={{
            title: "Home",
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="UploadPost_Screen"
          component={UploadPost_Screen}
          options={{
            title: "Upload Post",
            headerStyle: {
              backgroundColor: Colors.primaryColor10,
            },
            headerTitleStyle: {
              color: Colors.primaryColor50,
              fontFamily: "BubblegumSans-Regular",
              fontSize: scale(23),
            },
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="EmployeeList_Screen"
          component={EmployeeList_Screen}
          options={{
            title: "Employees",
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                name={focused ? "briefcase" : "briefcase-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile_Screen"
          component={Profile_Screen}
          options={{
            title: "Profile",
            tabBarIcon: ({ size, color, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default HomeNav;
