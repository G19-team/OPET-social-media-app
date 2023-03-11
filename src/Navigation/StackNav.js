//Screen componnets.
import Start_Screen from "../Screens/StartScreen/Start_Screen";
import LogIn_Screen from "../Screens/Login/LogIn_Screen";
import UserRegister_Screen from "../Screens/UserRegister/UserRegister_Screen";
import OrganizationRegister_Screen from "../Screens/OrganizationRegister/OrganizationRegister_Screen";
import EditProfile_Screen from "../Screens/EditProfle/EditProfile_screen";
import DocumentViewer_Screen from "../Screens/DocumentVIewer/DocumentViewer_Screen";
import Splash_Screen from "../Screens/SplashScreen/Splash_Screen";
import Suggestion from "../Screens/SuggestionScreen/Suggestion";
import HomeNav from "./HomeNav";

//libraries for navigation.
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useState, useEffect } from "react";

//intializing stack navigatore.
const Stack = createNativeStackNavigator();

import React from "react";
import { moderateScale } from "react-native-size-matters";

const StackNav = () => {
  const [showSplashscreen, setshowSplashscreen] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setshowSplashscreen(false);
    }, 3000);
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {showSplashscreen ? (
          <Stack.Screen
            name={"Splash_Screen"}
            component={Splash_Screen}
            options={{ headerShown: false }}
          />
        ) : null}
        <Stack.Screen
          name={"Start_Screen"}
          component={Start_Screen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={"LogIn_Screen"}
          component={LogIn_Screen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={"UserRegister_Screen"}
          component={UserRegister_Screen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={"OrganizationRegister_Screen"}
          component={OrganizationRegister_Screen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={"EditProfile_Screen"}
          component={EditProfile_Screen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name={"DocumentViewer_Screen"}
          component={DocumentViewer_Screen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Suggestion"
          component={Suggestion}
          options={{
            headerShown: true,
            contentStyle: {
              paddingHorizontal: moderateScale(11),
              backgroundColor: "#ffffff",
            },
          }}
        />
        <Stack.Screen
          name={"HomeNav"}
          component={HomeNav}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;
