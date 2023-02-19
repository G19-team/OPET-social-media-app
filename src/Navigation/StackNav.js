//Screen componnets.
import Start_Screen from "../Screens/StartScreen/Start_Screen";
import LogIn_Screen from "../Screens/Login/LogIn_Screen";
import UserRegister_Screen from "../Screens/UserRegister/UserRegister_Screen";
import OrganizationRegister_Screen from "../Screens/OrganizationRegister/OrganizationRegister_Screen";
import EditProfilePage from "../Components/EditProfile";
import HomeNav from "./HomeNav";

//libraries for navigation.
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//intializing stack navigatore.
const Stack = createNativeStackNavigator();

import React from "react";

const StackNav = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
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
          name={"HomeNav"}
          component={HomeNav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={"EditProfilePage"}
          component={EditProfilePage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNav;
