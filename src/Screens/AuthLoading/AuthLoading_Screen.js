import { StyleSheet, Text, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../db/firebaseConfig";

import React, { useLayoutEffect } from "react";
import { Colors } from "../../Assets/Colors/Colors";

const AuthLoading_Screen = ({ navigation }) => {
  useLayoutEffect(() => {
    const init = async () => {
      let usrName = await AsyncStorage.getItem("usrName");
      const password = await AsyncStorage.getItem("password");
      if (usrName && password) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            usrName,
            password
          );
          await navigation.replace("HomeNav");
        } catch (error) {
          navigation.replace("Start_Screen");
        }
      } else {
        navigation.replace("Start_Screen");
      }
    };
    init();
  }, []);

  return <View style={styles.container}></View>;
};

export default AuthLoading_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor500,
  },
});
