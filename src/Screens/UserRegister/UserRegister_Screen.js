import { View, Text, Alert } from "react-native";
import React, { useState } from "react";

import { styles } from "./Style";

import LbInputBox from "../../Components/LbInputBox";
import MyButton from "../../Components/MyButton";

import Ionicons from "@expo/vector-icons/Ionicons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const UserRegister_Screen = ({ navigation }) => {
  const upload = async () => {
    try {
      createUserWithEmailAndPassword(
        auth,
        details.Email,
        details.Password
      ).then((userCredential) => uploadUserData(userCredential));
    } catch {
      (e) => console.log(e);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View>
        <View style={[styles.heading, styles.center]}>
          <Text style={styles.headingtext}>User Registration</Text>
        </View>

        <View style={[styles.picturecontainer, styles.center]}>
          <View style={[styles.picture, styles.center]}>
            <Ionicons name="person" size={30} color="#000000" />
          </View>
          <MyButton title="choose picture" style={styles.picturebtn} />
        </View>

        <View style={styles.lblinput}>
          <LbInputBox lable="Organization ID :" />
          <View style={styles.twobox}>
            <LbInputBox lable="First name :" outstyle={styles.name} />
            <LbInputBox lable="Middle name :" outstyle={styles.name} />
          </View>
          <LbInputBox lable="Last name :" />
          <View style={styles.twobox}>
            <LbInputBox lable="City :" outstyle={styles.name} />
            <LbInputBox lable="Country :" outstyle={styles.name} />
          </View>
          <View style={styles.twobox}>
            <LbInputBox lable="State / Region :" outstyle={styles.name} />
            <LbInputBox lable="Postal code :" outstyle={styles.name} />
          </View>
          <LbInputBox lable="Phone number :" />
          <LbInputBox lable="E-mail :" />
          <LbInputBox lable="Gender :" />
          <LbInputBox lable="Birth date :" />
          <LbInputBox lable="UserName :" />
          <LbInputBox lable="Password :" />
        </View>

        <MyButton
          title="Register"
          style={styles.btn}
          fontStyle={styles.fontstyle}
        />
        <MyButton
          title="Clear All"
          style={styles.btn}
          fontStyle={styles.fontstyle}
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
    </KeyboardAwareScrollView>
  );
};

export default UserRegister_Screen;
