import { View, Text } from "react-native";
import React, { useState } from "react";

import { styles } from "./Style";

import LbInputBox from "../../Components/LbInputBox";

import Ionicons from "@expo/vector-icons/Ionicons";
import MyButton from "../../Components/MyButton";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { db } from "../../db/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

const OrganizationRegister_Screen = ({ navigation }) => {
  const [orgname, setorgname] = useState(null);
  const [orgemail, setorgemail] = useState(null);
  const [orgconnum, setorgconnum] = useState(null);
  const [orgadd, setorgadd] = useState(null);
  const [orgabout, setorgabout] = useState(null);
  const [orgusername, setorgusername] = useState(null);
  const [orgpassword, setorgpassword] = useState(null);

  const orgsavedata = async () => {
    const docRef = await setDoc(
      doc(db, "organization", (Math.random() * 100000).toFixed().toString()),
      {
        orgname: orgname,
        orgemail: orgemail,
        orgconnum: orgconnum,
        orgadd: orgadd,
        orgabout: orgabout,
        orgusername: orgusername,
        orgpassword: orgpassword,
      }
    ).then((e) => console.log(e));
  };

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

      <LbInputBox
        lable="Organization Name :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgname(text)}
      />
      <LbInputBox
        lable="Organization E-mail :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgemail(text)}
      />
      <LbInputBox
        lable="Organization Contact Number :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgconnum(text)}
      />
      <LbInputBox
        lable="Address :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgadd(text)}
      />
      <LbInputBox
        lable="About Organization :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgabout(text)}
      />

      <Text style={styles.info}>Enter Username and Password</Text>
      <LbInputBox
        lable="Username :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgusername(text)}
      />
      <LbInputBox
        lable="Password :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgpassword(text)}
      />

      <MyButton
        title="Register"
        style={styles.btn}
        fontStyle={styles.fontstyle}
        onPress={() => {
          orgsavedata();
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
