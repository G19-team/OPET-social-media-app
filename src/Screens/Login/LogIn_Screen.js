import { Text, View, Image, TextInput, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";

//responsiev library
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

import { styles } from "./Style";

//custome components
import LbInputBox from "../../Components/LbInputBox";
import MyButton from "../../Components/MyButton";

//for keyboard scroll
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// it is the fb
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../db/firebaseConfig";
import {
  query,
  where,
  doc,
  getDocs,
  getDoc,
  collection,
} from "firebase/firestore";
import alert from "../../Utills/alert";

//libary used to store value , object in local storage of mobile.
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogIn_Screen = ({ navigation }) => {
  const [logInDetails, setLogInDetails] = useState({
    organizationID: "",
    UserName: "",
    Password: "",
  });

  const handleLogin = async () => {
    if (
      !logInDetails.organizationID ||
      !logInDetails.UserName ||
      !logInDetails.Password
    ) {
      alert("Waring", "Please enter all above field..");
      return 0;
    }
    const orgRef = doc(db, "organization", logInDetails.organizationID);
    const orgDoc = await getDoc(orgRef);

    if (orgDoc.exists()) {
      const userRef = query(
        collection(db, "organization", logInDetails.organizationID, "users"),
        where("UserName", "==", logInDetails.UserName)
      );
      const userDoc = await getDocs(userRef);
      if (userDoc.size > 0) {
        const user = userDoc.docs[0].data();
        if (user.Password === logInDetails.Password) {
          if (user.isAllowed) {
            // Login successful
            login();
          } else {
            //console.log("User is not allowed to log in");
            alert(
              "User is not allowed to log in please contact your organization"
            );
          }
        } else {
          //console.log("Incorrect password");
          alert("Wrong password ");
        }
      } else {
        // console.log("User does not exist in this organization");
        alert("User does not exist in this organization ");
      }
    } else {
      alert("Organization does not exist");
    }
  };

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        logInDetails.UserName,
        logInDetails.Password
      );
      const user = userCredential.user;
      AsyncStorage.setItem("orgId", logInDetails.organizationID);
      AsyncStorage.setItem("usrName", logInDetails.UserName);
      AsyncStorage.setItem("password", logInDetails.Password);
      navigation.navigate("HomeNav");
      setLogInDetails({ organizationID: "", UserName: "", Password: "" });
    } catch (error) {
      const errorMessage = error.message;
      if (errorMessage === "Firebase: Error (auth/invalid-email).") {
        alert("Warning!", "Please check your user name");
      } else if (errorMessage === "Firebase: Error (auth/wrong-password).") {
        alert("Warning!", "Please check your password");
      } else if (errorMessage === "Firebase: Error (auth/user-not-found).") {
        alert("Warning!", "your account does't exist");
      } else {
        alert("Warning!", "Something went wrong");
      }
    }
    // });
  };

  return (
    <>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.topleftimg}>
          <Image
            source={require("../../Assets/Img/Top_Left.png")}
            resizeMode="contain"
            style={{ width: moderateScale(100), height: moderateScale(100) }}
          />
        </View>
        <View>
          <View style={styles.top}>
            <Text style={styles.heading}>Log in</Text>
            <Image
              source={require("../../Assets/Gif/107117-celebration-card-authentication.json")}
            />
          </View>

          <LbInputBox
            lable="Organization ID :"
            iconName="briefcase-outline"
            outstyle={styles.lblinput}
            onChangeText={(data) =>
              setLogInDetails({ ...logInDetails, organizationID: data })
            }
            keyboardType="number-pad"
            value={logInDetails.organizationID}
            require
          />
          <LbInputBox
            lable="User Name :"
            iconName="person-outline"
            outstyle={styles.lblinput}
            onChangeText={(data) =>
              setLogInDetails({ ...logInDetails, UserName: data })
            }
            value={logInDetails.UserName}
            require
          />
          <LbInputBox
            lable="Password :"
            iconName="lock-closed-outline"
            outstyle={styles.lblinput}
            secureTextEntry={true}
            onChangeText={(data) =>
              setLogInDetails({ ...logInDetails, Password: data })
            }
            value={logInDetails.Password}
            require
          />

          <MyButton
            title="Log in"
            style={styles.btn}
            fontStyle={styles.fontstyle}
            onPress={() => {
              handleLogin();
            }}
          />

          <MyButton
            title="< Back"
            style={styles.btn}
            fontStyle={styles.fontstyle}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.bottomimg}>
          <Image
            source={require("../../Assets/Img/Bottom.png")}
            resizeMode="cover"
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default LogIn_Screen;
