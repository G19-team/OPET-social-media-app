import { StyleSheet, Text, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  query,
  where,
  doc,
  getDocs,
  getDoc,
  collection,
} from "firebase/firestore";
import { auth, db } from "../../db/firebaseConfig";

import React, { useLayoutEffect } from "react";
import { Colors } from "../../Assets/Colors/Colors";

const AuthLoading_Screen = ({ navigation }) => {
  useLayoutEffect(() => {
    const init = async () => {
      let orgId = await AsyncStorage.getItem("orgId");
      let usrName = await AsyncStorage.getItem("usrName");
      const password = await AsyncStorage.getItem("password");
      if (usrName && password && orgId) {
        const orgRef = doc(db, "organization", orgId);
        const orgDoc = await getDoc(orgRef);
        if (orgDoc.exists()) {
          const userRef = query(
            collection(db, "organization", orgId, "users"),
            where("UserName", "==", usrName)
          );
          const userDoc = await getDocs(userRef);
          if (userDoc.size > 0) {
            const user = userDoc.docs[0].data();
            if (user.Password === password) {
              if (user.isAllowed) {
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
                //console.log("User is not allowed to log in");
                navigation.replace("Start_Screen");
              }
            } else {
              navigation.replace("Start_Screen");
            }
          } else {
            navigation.replace("Start_Screen");
          }
        } else {
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
