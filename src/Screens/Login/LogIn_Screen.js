import { Text, View, Image, TextInput, ScrollView } from "react-native";
import React, { useState } from "react";

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



const LogIn_Screen = ({ navigation }) => {
  const [logInDetails, setLogInDetails] = useState({
    organizationID: "",
    UserName: "",
    Password: "",
  });

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
            require={true}
          />
          <LbInputBox
            lable="User Name :"
            iconName="person-outline"
            outstyle={styles.lblinput}
          />
          <LbInputBox
            lable="Password :"
            iconName="lock-closed-outline"
            outstyle={styles.lblinput}
            secureTextEntry={true}
          />

          <MyButton
            title="Log in"
            style={styles.btn}
            fontStyle={styles.fontstyle}
            onPress={() => {
              navigation.navigate("HomeNav");
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
