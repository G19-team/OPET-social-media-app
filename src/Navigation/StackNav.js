//Screen componnets.
import Start_Screen from "../Screens/StartScreen/Start_Screen";
import LogIn_Screen from "../Screens/Login/LogIn_Screen";
import UserRegister_Screen from "../Screens/UserRegister/UserRegister_Screen";
import OrganizationRegister_Screen from "../Screens/OrganizationRegister/OrganizationRegister_Screen";
// import EditProfile_Screen from "../Screens/EditProfle/EditProfile_Screen";
import EditProfile_Screen from "../Screens/EditProfle/EditProfile_Screen";
import DocumentViewer_Screen from "../Screens/DocumentVIewer/DocumentViewer_Screen";
import Suggestion from "../Screens/SuggestionScreen/Suggestion";
import AuthLoading_Screen from "../Screens/AuthLoading/AuthLoading_Screen";
import StorieView_Screen from "../Screens/StorieView/StorieView_Screen";
import HomeNav from "./HomeNav";

//libraries for navigation.
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//intializing stack navigatore.
const Stack = createNativeStackNavigator();

import React, { useLayoutEffect } from "react";
import { moderateScale } from "react-native-size-matters";

const StackNav = ({ isUserLoggedIn }) => {
  const navigation = useNavigation();

  if (isUserLoggedIn) {
    navigation.navigate("HomeNav");
    return null;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"AuthLoading_Screen"}
        component={AuthLoading_Screen}
        options={{ headerShown: false }}
      />
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
        options={{ headerShown: true, title: "Edit your profile" }}
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
        name="StorieView_Screen"
        component={StorieView_Screen}
        options={{
          headerShown: false,
          contentStyle: {
            paddingHorizontal: moderateScale(11),
            backgroundColor: "#252525",
          },
        }}
      />
      <Stack.Screen
        name={"HomeNav"}
        component={HomeNav}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StackNav;
