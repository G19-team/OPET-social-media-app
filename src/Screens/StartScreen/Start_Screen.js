import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Button,
  Alert,
} from "react-native";

import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

import React from "react";
import MyButton from "../../Components/MyButton";

import { styles } from "./Style";

const Start_Screen = ({ navigation }) => {
  const greeting = `Hey There,
Welcome to OPET
this is an social media application of office`;

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.topleftimg}>
          <Image
            source={require("../../Assets/Img/Top_Left.png")}
            resizeMode="contain"
            style={{ width: moderateScale(100), height: moderateScale(100) }}
          />
        </View>

        <View style={styles.logocontainer}>
          <ImageBackground
            source={require("../../Assets/Img/OPET_LOGO.png")}
            resizeMode="cover"
            style={styles.logo}
          >
            <Text style={styles.logotext}>OPET</Text>
          </ImageBackground>
          <Text style={styles.text}>{greeting}</Text>
        </View>

        <View style={styles.innercontainer}>
          <MyButton
            title="Log in"
            style={styles.btn}
            fontStyle={styles.fontstyle}
            onPress={() => {
              navigation.navigate("LogIn_Screen");
            }}
          />
          <MyButton
            title="User Register"
            style={styles.btn}
            fontStyle={styles.fontstyle}
            onPress={() => {
              navigation.navigate("UserRegister_Screen");
            }}
          />
          <MyButton
            title="Organization Register"
            style={styles.btn}
            fontStyle={styles.fontstyle}
            onPress={() => {
              navigation.navigate("OrganizationRegister_Screen");
            }}
          />
          <Button title="debuge" onPress={() => Alert.alert("hi")} />
        </View>
      </ScrollView>

      <View style={styles.bottomimg}>
        <Image
          source={require("../../Assets/Img/Bottom.png")}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default Start_Screen;
