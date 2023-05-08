import { View, Text } from "react-native";
import React, { useState } from "react";

import { styles } from "./Style";

import LbInputBox from "../../Components/LbInputBox";

import alert from "../../Utills/alert";

import Ionicons from "@expo/vector-icons/Ionicons";
import MyButton from "../../Components/MyButton";

import { Checkbox } from "react-native-paper";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { db, storage } from "../../db/firebaseConfig";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";

import FitImage from "react-native-fit-image";

import * as ImagePicker from "expo-image-picker";
import sendEmail from "../../Utills/Mailer";
import { moderateScale } from "react-native-size-matters";

const OrganizationRegister_Screen = ({ navigation }) => {
  const [orgname, setorgname] = useState("");
  const [orgemail, setorgemail] = useState("");
  const [orgconnum, setorgconnum] = useState("");
  const [orgadd, setorgadd] = useState("");
  const [orgabout, setorgabout] = useState("");
  const [orgusername, setorgusername] = useState("");
  const [orgpassword, setorgpassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [orgImage, setImage] = useState("");

  //Error states
  const [orgnameError, setorgnameError] = useState("");
  const [orgemailError, setorgemailError] = useState("");
  const [orgconnumError, setorgconnumError] = useState("");
  const [orgaddError, setorgaddError] = useState("");
  const [orgaboutError, setorgaboutError] = useState("");
  const [orgusernameError, setorgusernameError] = useState("");
  const [orgpasswordError, setorgpasswordError] = useState("");
  const [orgImageError, setImageError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(false);
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

  const handleSubmit = () => {
    let emailEr = false;
    let orgnameEr = false;
    let orgconnumEr = false;
    let orgaddEr = false;
    let orgaboutEr = false;
    let orgpasswordEr = false;
    let orgImageEr = false;
    if (!orgemail) {
      emailEr = true;
      setorgemailError("Please enter your email");
    } else {
      if (!/\S+@\S+\.\S+/.test(orgemail)) {
        emailEr = true;
        setorgemailError("please enter vaild email");
      } else {
        emailEr = false;
        setorgemailError("");
      }
    }

    if (!orgname) {
      orgnameEr = true;
      setorgnameError("Please enter your org name  ");
    } else {
      if (!/^[a-zA-Z]+$/.test(orgname)) {
        orgnameEr = true;
        setorgnameError("Please enter only alphabets");
      } else {
        orgnameEr = false;
        setorgnameError("");
      }
    }

    if (!orgconnum) {
      orgconnumEr = true;
      setorgconnumError("Please enter your contact number  ");
    } else {
      if (orgconnum.length < 10) {
        orgconnumEr = true;
        setorgconnumError("please provide 10 digits");
      } else {
        orgconnumEr = false;
        setorgconnumError("");
      }
    }
    if (!orgadd) {
      orgaddEr = true;
      setorgaddError("Please enter address  ");
    } else {
      orgaddEr = false;
      setorgaddError("");
    }

    if (!orgabout) {
      orgaboutEr = true;
      setorgaboutError("Please enter your about   ");
    } else {
      orgaboutEr = false;
      setorgaboutError("");
    }

    if (!orgemail) {
      emailEr = true;
      setorgusernameError("Please enter your username");
    } else {
      if (!/\S+@\S+\.\S+/.test(orgemail)) {
        emailEr = true;
        setorgusernameError("please enter vaild email");
      } else {
        emailEr = false;
        setorgusernameError("");
      }
    }

    if (!orgpassword) {
      orgpasswordEr = true;
      setorgpasswordError("Please enter your password");
    } else {
      if (orgpassword.length < 6) {
        orgpasswordEr = true;
        setorgpasswordError("Password must be of 6 length");
      } else if (
        !/[A-Z]/.test(orgpassword) ||
        !/[@#$%^&+=]/.test(orgpassword) ||
        !/[0-9]/.test(orgpassword)
      ) {
        orgpasswordEr = true;
        setorgpasswordError(
          "Password must contain  at least one capital letter, special symbol, digit, and at least 6 characters."
        );
      } else {
        orgpasswordEr = false;
        setorgpasswordError("");
      }
    }

    if (!orgImage) {
      orgImageEr = true;
      setImageError("Please set your image");
    } else {
      orgImageEr = false;
      setImageError("");
    }

    if (
      !(
        emailEr ||
        orgnameEr ||
        orgconnumEr ||
        orgaddEr ||
        orgaboutEr ||
        orgpasswordEr ||
        orgImageEr
      )
    ) {
      picupload();
    }
  };

  const picupload = async () => {
    setIsLoading(true);
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
        {orgImageError ? (
          <Text style={[styles.error]}>{orgImageError}</Text>
        ) : null}
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
        style={[orgnameError && styles.inputError]}
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgname(text)}
        value={orgname}
      />
      {orgnameError ? <Text style={styles.error}>{orgnameError}</Text> : null}
      <LbInputBox
        lable="Organization E-mail :"
        style={[orgemailError && styles.inputError]}
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgemail(text)}
        value={orgemail}
      />
      {orgemailError ? <Text style={styles.error}>{orgemailError}</Text> : null}
      <LbInputBox
        lable="Organization Contact Number :"
        style={[orgconnumError && styles.inputError]}
        maxLength={10}
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgconnum(text)}
        value={orgconnum}
        keyboardType="number-pad"
      />
      {orgconnumError ? (
        <Text style={styles.error}>{orgconnumError}</Text>
      ) : null}

      <LbInputBox
        lable="Address :"
        outstyle={styles.lblinput}
        style={[orgaddError && styles.inputError]}
        onChangeText={(text) => setorgadd(text)}
        value={orgadd}
        multiline={true}
      />
      {orgaddError ? <Text style={styles.error}>{orgaddError}</Text> : null}
      <LbInputBox
        lable="About Organization :"
        style={[orgaddError && styles.inputError]}
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgabout(text)}
        value={orgabout}
        multiline={true}
      />
      {orgaboutError ? <Text style={styles.error}>{orgaboutError}</Text> : null}
      <Text style={styles.info}>Enter Username and Password</Text>
      <LbInputBox
        lable="Username :"
        style={[orgaboutError && styles.inputError]}
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgemail(text)}
        value={orgemail}
      />
      {orgusernameError ? (
        <Text style={styles.error}>{orgusernameError}</Text>
      ) : null}

      <LbInputBox
        lable="Password :"
        style={[orgpasswordError && styles.inputError]}
        outstyle={styles.lblinput}
        onChangeText={(text) => setorgpassword(text)}
        secureTextEntry={!checked}
        value={orgpassword}
      />
      {orgpasswordError ? (
        <Text style={styles.error}>{orgpasswordError}</Text>
      ) : null}
      <View
        style={{
          marginLeft: moderateScale(27),
          flexDirection: "row",
          alignItems: "center",
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
        title="Register"
        style={styles.btn}
        fontStyle={styles.fontstyle}
        isLoading={isLoading}
        disabled={isLoading}
        onPress={() => {
          handleSubmit();
        }}
      />
      <MyButton
        title="Clear all"
        onPress={() => clearAll()}
        style={styles.btn}
        disabled={isLoading}
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
