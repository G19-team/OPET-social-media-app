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
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../db/firebaseConfig";
import alert from "../../Utills/alert";

//libary used to store value , object in local storage of mobile.
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogIn_Screen = ({ navigation }) => {
  const [logInDetails, setLogInDetails] = useState({
    organizationID: "",
    UserName: "",
    Password: "",
  });

  const login = () => {
    signInWithEmailAndPassword(
      auth,
      logInDetails.UserName,
      logInDetails.Password
    )
      .then((userCredential) => {
        console.log(userCredential.user);
        const user = userCredential.user;
        AsyncStorage.setItem("orgId", logInDetails.organizationID);
        navigation.replace("HomeNav");
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        if (errorMessage === "Firebase: Error (auth/invalid-email).") {
          alert("Validation!", "your email address is wrong");
        } else if (errorMessage === "Firebase: Error (auth/wrong-password).") {
          alert("Validation!", "your password is wrong");
        }
      });
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
            require
          />
          <LbInputBox
            lable="User Name :"
            iconName="person-outline"
            outstyle={styles.lblinput}
            onChangeText={(data) =>
              setLogInDetails({ ...logInDetails, UserName: data })
            }
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
            require
          />

          <MyButton
            title="Log in"
            style={styles.btn}
            fontStyle={styles.fontstyle}
            onPress={() => {
              login();
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
