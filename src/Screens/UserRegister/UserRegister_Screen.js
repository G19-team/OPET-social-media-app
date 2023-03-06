import { View, Text, Alert } from "react-native";
import React, { useState } from "react";

import { styles } from "./Style";

import LbInputBox from "../../Components/LbInputBox";
import MyButton from "../../Components/MyButton";

import Ionicons from "@expo/vector-icons/Ionicons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { createUserWithEmailAndPassword } from "firebase/auth";

import { collection, addDoc, setDoc, doc, updateDoc } from "firebase/firestore";

import { auth, db } from "../../db/firebaseConfig";

// user create in db

const UserRegister_Screen = ({ navigation }) => {
  const [organizationId, setOrganizationId] = useState(null);
  const [fname, setfname] = useState(null);
  const [mname, setmname] = useState(null);
  const [lname, setlname] = useState(null);
  const [city, setcity] = useState(null);
  const [country, setcountry] = useState(null);
  const [state, setstate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [gender, setGender] = useState(null);
  const [bdate, setbdate] = useState(null);
  const [username, setusername] = useState(null);
  const [password, setPassword] = useState(null);

  // const upload = async () => {
  //   try {
  //     createUserWithEmailAndPassword(
  //       auth,
  //       details.Email,
  //       details.Password
  //     ).then((userCredential) => uploadUserData(userCredential));
  //   } catch {
  //     (e) => console.log(e);
  //   }
  // };

  const savedetails = async (uid) => {
    // Add a new document with a generated id.
    const Ref = doc(db, "organization", organizationId);
    const docRef = await setDoc(doc(Ref, "users", uid), {
      OrganizationID: organizationId,
      Firstname: fname.toLowerCase(),
      Middlename: mname.toLowerCase(),
      Lastname: lname.toLowerCase(),
      Country: country,
      City: city,
      State: state,
      Phonenumber: phoneNumber,
      Email: email,
      Gender: gender,
      Birthdate: bdate,
      UserName: username,
      Password: password,
    });
  };

  const Registration = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        savedetails(user.uid);
        alert("user reg  details saved successfully");
        navigation.replace("Start_Screen");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
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
          <LbInputBox
            lable="Organization ID :"
            onChangeText={(text) => setOrganizationId(text)}
            keyboardType="number-pad"
          />
          <View style={styles.twobox}>
            <LbInputBox
              lable="First name :"
              outstyle={styles.name}
              onChangeText={(text) => setfname(text)}
            />
            <LbInputBox
              lable="Middle name :"
              outstyle={styles.name}
              onChangeText={(text) => setmname(text)}
            />
          </View>
          <LbInputBox
            lable="Last name :"
            onChangeText={(text) => setlname(text)}
          />
          <View style={styles.twobox}>
            <LbInputBox
              lable="City :"
              outstyle={styles.name}
              onChangeText={(text) => setcity(text)}
            />
            <LbInputBox
              lable="Country :"
              outstyle={styles.name}
              onChangeText={(text) => setcountry(text)}
            />
          </View>
          <View style={styles.twobox}>
            <LbInputBox
              lable="State / Region :"
              outstyle={styles.name}
              onChangeText={(text) => setstate(text)}
            />
            <LbInputBox lable="Postal code :" outstyle={styles.name} />
          </View>
          <LbInputBox
            lable="Phone number :"
            onChangeText={(text) => setPhoneNumber(text)}
          />
          <LbInputBox
            lable="E-mail :"
            onChangeText={(text) => setEmail(text)}
          />
          <LbInputBox
            lable="Gender :"
            onChangeText={(text) => setGender(text)}
          />
          <LbInputBox
            lable="Birth date :"
            onChangeText={(text) => setbdate(text)}
          />
          <LbInputBox
            lable="UserName :"
            onChangeText={(text) => setusername(text)}
            value={email}
          />
          <LbInputBox
            lable="Password :"
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <MyButton
          title="Register"
          style={styles.btn}
          fontStyle={styles.fontstyle}
          onPress={() => Registration()}
          // onPress={()=>savedetails()}
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
