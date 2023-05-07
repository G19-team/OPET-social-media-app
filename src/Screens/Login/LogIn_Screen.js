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

import { Checkbox } from "react-native-paper";

const LogIn_Screen = ({ navigation }) => {
  const [logInDetails, setLogInDetails] = useState({
    organizationID: "",
    UserName: "",
    Password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    if (
      !logInDetails.organizationID ||
      !logInDetails.UserName ||
      !logInDetails.Password
    ) {
      alert("Waring", "Please enter all above field..");
      setIsLoading(false);
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
            setIsLoading(false);
            alert(
              "User is not allowed to log in please contact your organization"
            );
          }
        } else {
          setIsLoading(false);
          //console.log("Incorrect password");
          alert("Wrong password ");
        }
      } else {
        setIsLoading(false);
        // console.log("User does not exist in this organization");
        alert("User does not exist in this organization ");
      }
    } else {
      setIsLoading(false);
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
      await navigation.popToTop();
      await navigation.replace("HomeNav");
      AsyncStorage.setItem("orgId", logInDetails.organizationID);
      AsyncStorage.setItem("usrName", logInDetails.UserName);
      AsyncStorage.setItem("password", logInDetails.Password);
      setIsLoading(false);
      setLogInDetails({ organizationID: "", UserName: "", Password: "" });
    } catch (error) {
      const errorMessage = error.message;
      if (errorMessage === "Firebase: Error (auth/invalid-email).") {
        setIsLoading(false);
        alert("Warning!", "Please check your user name");
      } else if (errorMessage === "Firebase: Error (auth/wrong-password).") {
        setIsLoading(false);
        alert("Warning!", "Please check your password");
      } else if (errorMessage === "Firebase: Error (auth/user-not-found).") {
        setIsLoading(false);
        alert("Warning!", "your account does't exist");
      } else {
        setIsLoading(false);
        alert("Warning!", "Something went wrong");
      }
    }
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
            secureTextEntry={!checked}
            onChangeText={(data) =>
              setLogInDetails({ ...logInDetails, Password: data })
            }
            value={logInDetails.Password}
            require
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: moderateScale(25),
            }}
          >
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
              color="#E0BAFD"
            />
            <Text>Show password</Text>
          </View>

          <MyButton
            title="Log in"
            style={styles.btn}
            fontStyle={styles.fontstyle}
            isLoading={isLoading}
            disabled={isLoading}
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
