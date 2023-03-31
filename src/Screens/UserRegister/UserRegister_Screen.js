import { View, Text, Alert } from "react-native";
import React, { useState } from "react";

import { styles } from "./Style";

import LbInputBox from "../../Components/LbInputBox";
import MyButton from "../../Components/MyButton";

import Ionicons from "@expo/vector-icons/Ionicons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as ImagePicker from "expo-image-picker";

import FitImage from "react-native-fit-image";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { auth, db, storage } from "../../db/firebaseConfig";

// user create in db

const UserRegister_Screen = ({ navigation }) => {
  const [fname, setfname] = useState(null);
  const [mname, setmname] = useState(null);
  const [lname, setlname] = useState(null);
  const [role, setRole] = useState(null);
  const [city, setcity] = useState(null);
  const [country, setcountry] = useState(null);
  const [state, setstate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [gender, setGender] = useState(null);
  const [bdate, setbdate] = useState(null);
  const [username, setusername] = useState(null);
  const [password, setPassword] = useState(null);
  const [orgid, setorgid] = useState(null);
  const [usrImage, setUsrImage] = useState(null);

  const clearAll = () => {
    setfname("");
    setmname("");
    setlname("");
    setRole("");
    setcity("");
    setcountry("");
    setstate("");
    setstate("");
    setPhoneNumber("");
    setEmail("");
    setGender("");
    setbdate("");
    setusername("");
    setPassword("");
    setorgid("");
    setUsrImage("");
  };

  const savedetails = async (firebaseImageUrl, uid) => {
    // Add a new document with a generated id.
    const Ref = doc(db, "organization", orgid);
    const docRef = await setDoc(doc(Ref, "users", uid), {
      Firstname: fname.toLowerCase(),
      Middlename: mname.toLowerCase(),
      Lastname: lname.toLowerCase(),
      role: role,
      Country: country,
      City: city,
      State: state,
      Phonenumber: phoneNumber,
      Email: email,
      Gender: gender,
      Birthdate: bdate,
      UserName: email,
      Password: password,
      OrganizationID: orgid,
      UserImage: firebaseImageUrl,
      isAllowed: 1,
      StoryUrl: null,
    })
      .then(() => {
        navigation.replace("Start_Screen");
        alert("Successfully registered", "your user is registered in OPET ");
        clearAll();
      })
      .catch((e) => alert("registartion failed", "Something went wrong!" + e));
  };

  const choosepic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
    }).then((result) => {
      if (!result?.canceled) {
        setUsrImage(result.assets[0].uri);
      }
    });
  };

  const picupload = async (uid) => {
    if (!usrImage) {
      Alert.alert("hello !!");
      return 0;
    }
    let result = await fetch(usrImage);
    const blobImage = await result.blob();
    const filename = usrImage.substring(usrImage.lastIndexOf("/") + 1);
    const storageRef = ref(storage, "USRPIC/" + filename);
    const uploadTask = uploadBytesResumable(storageRef, blobImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if ((snapshot.bytesTransferred / snapshot.totalBytes) * 100 == 100) {
          Alert.alert(
            "Successfully completed",
            "your image  is successfully uploaded"
          );
        }
      },
      (error) => {
        Alert.alert(
          "Failed to upload",
          "tamro vak che atle error to ave she j ne bhai "
        );
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          savedetails(downloadURL, uid);
        });
      }
    );
  };

  const Registration = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        picupload(user.uid);
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
            {usrImage ? (
              <FitImage
                source={{ uri: usrImage }}
                resizeMode="cover"
                style={{ width: 120, height: 120 }}
              />
            ) : (
              <Ionicons name="person" size={30} color="#000000" />
            )}
          </View>
          <View style={{ flexDirection: "row" }}>
            <MyButton
              title="choose picture"
              style={styles.picturebtn}
              onPress={choosepic}
            />
            <MyButton
              title="Remove picture"
              style={styles.picturebtn}
              onPress={() => setUsrImage("")}
            />
          </View>
        </View>

        <View style={styles.lblinput}>
          <LbInputBox
            lable="Organization ID :"
            onChangeText={(text) => setorgid(text)}
            keyboardType="number-pad"
            value={orgid}
          />
          <View style={styles.twobox}>
            <LbInputBox
              lable="First name :"
              outstyle={styles.name}
              onChangeText={(text) => setfname(text)}
              value={fname}
            />
            <LbInputBox
              lable="Middle name :"
              outstyle={styles.name}
              onChangeText={(text) => setmname(text)}
              value={mname}
            />
          </View>
          <LbInputBox
            lable="Last name :"
            onChangeText={(text) => setlname(text)}
            value={lname}
          />
          <LbInputBox
            lable="Your role in organization :"
            onChangeText={(text) => setRole(text)}
            value={role}
          />
          <View style={styles.twobox}>
            <LbInputBox
              lable="City :"
              outstyle={styles.name}
              onChangeText={(text) => setcity(text)}
              value={city}
            />
            <LbInputBox
              lable="Country :"
              outstyle={styles.name}
              onChangeText={(text) => setcountry(text)}
              value={country}
            />
          </View>
          <View style={styles.twobox}>
            <LbInputBox
              lable="State / Region :"
              outstyle={styles.name}
              onChangeText={(text) => setstate(text)}
              value={state}
            />
            <LbInputBox lable="Postal code :" outstyle={styles.name} />
          </View>
          <LbInputBox
            lable="Phone number :"
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
          />
          <LbInputBox
            lable="E-mail :"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <LbInputBox
            lable="Gender :"
            onChangeText={(text) => setGender(text)}
            value={gender}
          />
          <LbInputBox
            lable="Birth date :"
            onChangeText={(text) => setbdate(text)}
            value={bdate}
          />
          <LbInputBox
            lable="UserName :"
            onChangeText={(text) => setusername(text)}
            value={email}
          />
          <LbInputBox
            lable="Password :"
            onChangeText={(text) => setPassword(text)}
            value={password}
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
