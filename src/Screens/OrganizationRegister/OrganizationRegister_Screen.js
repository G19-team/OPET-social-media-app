import { View, Text } from "react-native";
import React, { useState } from "react";

import { styles } from "./Style";

import LbInputBox from "../../Components/LbInputBox";

import Ionicons from "@expo/vector-icons/Ionicons";
import MyButton from "../../Components/MyButton";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const OrganizationRegister_Screen = ({ navigation }) => {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={[styles.heading, styles.center]}>
        <Text style={styles.headingtext}>Organization Registration</Text>
      </View>

      <View style={[styles.picturecontainer, styles.center]}>
        <View style={[styles.picture, styles.center]}>
          <Ionicons name="person" size={30} color="#000000" />
        </View>
        <MyButton title="choose picture" style={styles.picturebtn} />
      </View>

      <LbInputBox lable="Organization Name :" outstyle={styles.lblinput} />
      <LbInputBox lable="Organization E-mail :" outstyle={styles.lblinput} />
      <LbInputBox
        lable="Organization Contact Number :"
        outstyle={styles.lblinput}
      />
      <LbInputBox lable="Address :" outstyle={styles.lblinput} />
      <LbInputBox lable="About Organization :" outstyle={styles.lblinput} />

      <Text style={styles.info}>Enter Username and Password</Text>
      <LbInputBox lable="Username :" outstyle={styles.lblinput} />
      <LbInputBox lable="Password :" outstyle={styles.lblinput} />

      <MyButton
        title="Register"
        style={styles.btn}
        fontStyle={styles.fontstyle}
        onPress={() => {
          console.log(details);
        }}
      />
      <MyButton
        title="Clear all"
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
    </KeyboardAwareScrollView>
  );
};

export default OrganizationRegister_Screen;
