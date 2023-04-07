import { View, Text } from "react-native";
import React, { useState } from "react";

import { styles } from "./Style";

import LbInputBox from "../../Components/LbInputBox";

import alert from "../../Utills/alert";

import Ionicons from "@expo/vector-icons/Ionicons";
import MyButton from "../../Components/MyButton";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { db, storage } from "../../db/firebaseConfig";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";

import FitImage from "react-native-fit-image";

import * as ImagePicker from "expo-image-picker";
import { sendEmail } from "../../Utills/Mailer";

const OrganizationRegister_Screen = ({ navigation }) => {
  const [orgname, setorgname] = useState("");
  const [orgemail, setorgemail] = useState("");
  const [orgconnum, setorgconnum] = useState("");
  const [orgadd, setorgadd] = useState("");
  const [orgabout, setorgabout] = useState("");
  const [orgusername, setorgusername] = useState("");
  const [orgpassword, setorgpassword] = useState("");
  const [orgImage, setImage] = useState("");

  const sendMail = (orgName, toEmail, subject, orgId, userName, password) => {
    sendEmail(
      orgName,
      toEmail,
      subject,
      orgId,
      userName,
      password,
      "d-37a62b287b0f446caf297f63fa04ef9e"
    );
  };

  const clearAll = () => {
    setorgname("");
    setorgemail("");
    setorgconnum("");
    setorgadd("");
    setorgabout("");
    setorgusername("");
    setorgpassword("");
    setImage("");
  };
  const choosepic = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
    }).then((result) => {
      if (!result?.canceled) {
        setImage(result.assets[0].uri);
      }
    });
  };

  const orgsavedata = async (firebaseImageUrl) => {
    const nodeId = (Math.random() * 100000).toFixed().toString();
    const docRef = await setDoc(doc(db, "organization", nodeId), {
      Orgname: orgname,
      OrganizationEmail: orgemail,
      OrganizationContactNumber: orgconnum,
      Address: orgadd,
      AboutOrganization: orgabout,
      Username: orgemail,
      Password: orgpassword,
      Picture: firebaseImageUrl,
      OrgId: nodeId,
    }).then(() => {
      navigation.replace("Start_Screen");
      clearAll();
      alert(
        "Registered",
        "you will receive email about your credanitials soon, please check your emails"
      );

      sendMail(
        orgname,
        orgemail,
        "Login Credentials for Admin Panel on OPET",
        nodeId,
        orgemail,
        orgpassword
      );
    });
  };

  const picupload = async () => {
    if (!orgImage) {
      alert("Please select your organization logo");
      return 0;
    }
    const filename = orgImage.substring(orgImage.lastIndexOf("/") + 1);
    let result = await fetch(orgImage);
    const blobImage = await result.blob();
    const storageRef = ref(storage, "ORGPIC/" + filename);
    //const task = storageRef.put(blobImage);
    const uploadTask = uploadBytesResumable(storageRef, blobImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        alert("Failed to upload", "Something went wrong please try again...");
      },
      () => {
        //getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{}
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          orgsavedata(downloadURL);
        });
      }
    );
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={[styles.heading, styles.center]}>
        <Text style={styles.headingtext}>Organization Registration</Text>
      </View>

      <View style={[styles.picturecontainer, styles.center]}>
        <View style={[styles.picture, styles.center]}>
          {orgImage ? (
            <FitImage
              source={{ uri: orgImage }}
              resizeMode="cover"
              style={{ width: 120, height: 120 }}
            />
          ) : (
            <Ionicons name="person" size={30} color="#000000" />
          )}
        </View>
        <View style={{ flexDirection: "row" }}>
          <MyButton
            title="choose logo"
            style={styles.picturebtn}
            onPress={choosepic}
          />
          <MyButton
            title="Remove logo"
            style={styles.picturebtn}
            onPress={() => setImage("")}
          />
        </View>
      </View>

      <LbInputBox
        lable="Organization Name :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgname(text)}
        value={orgname}
      />
      <LbInputBox
        lable="Organization E-mail :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgemail(text)}
        value={orgemail}
      />
      <LbInputBox
        lable="Organization Contact Number :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgconnum(text)}
        value={orgconnum}
      />
      <LbInputBox
        lable="Address :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgadd(text)}
        value={orgadd}
        multiline={true}
      />
      <LbInputBox
        lable="About Organization :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgabout(text)}
        value={orgabout}
        multiline={true}
      />

      <Text style={styles.info}>Enter Username and Password</Text>
      <LbInputBox
        lable="Username :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgemail(text)}
        value={orgemail}
      />
      <LbInputBox
        lable="Password :"
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgpassword(text)}
        value={orgpassword}
      />

      <MyButton
        title="Register"
        style={styles.btn}
        fontStyle={styles.fontstyle}
        onPress={() => {
          picupload();
        }}
      />
      <MyButton
        title="Clear all"
        onPress={() => clearAll()}
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
        y
      />
    </KeyboardAwareScrollView>
  );
};

export default OrganizationRegister_Screen;
