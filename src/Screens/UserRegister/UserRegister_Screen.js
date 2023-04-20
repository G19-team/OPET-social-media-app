import { View, Text, Alert, Pressable } from "react-native";
import React, { useState } from "react";

import { styles } from "./Style";

import LbInputBox from "../../Components/LbInputBox";
import MyButton from "../../Components/MyButton";

import Ionicons from "@expo/vector-icons/Ionicons";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import * as ImagePicker from "expo-image-picker";

import FitImage from "react-native-fit-image";

import { Picker } from "@react-native-picker/picker";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import { auth, db, storage } from "../../db/firebaseConfig";

//for radio button
import RadioGroup from "react-native-radio-buttons-group";

//for date time picker
import DateTimePicker from "@react-native-community/datetimepicker";

import { moderateScale } from "react-native-size-matters";

// user create in db

const UserRegister_Screen = ({ navigation }) => {
  const date = new Date();
  const currentYear = date.getFullYear().toString();
  const currentMonth = (date.getMonth() + 1).toString(); // note: months are 0-indexed, so we add 1 to get the current month
  const currentDay = date.getDate().toString();
  const [fname, setfname] = useState(null);
  const [mname, setmname] = useState(null);
  const [lname, setlname] = useState(null);
  const [city, setcity] = useState(null);
  const [country, setcountry] = useState(null);
  const [state, setstate] = useState(null);
  const [postalcode, setpostalcode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [gender, setGender] = useState(null);
  const [radioButtons, setRadioButtons] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Male",
      value: "Male",
    },
    {
      id: "2",
      label: "Female",
      value: "Female",
    },
    {
      id: "3",
      label: "Other",
      value: "Other",
    },
  ]);
  const [bdate, setbdate] = useState(
    new Date(currentYear / currentMonth / currentDay)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  // const [username, setusername] = useState(null);
  const [password, setPassword] = useState(null);
  const [orgid, setorgid] = useState(null);
  const [usrImage, setUsrImage] = useState(null);
  const [selectrole, setselectrole] = useState("leader");
  const [selectsubrole, setselectsubrole] = useState("Manager");

  //const [loading, setLoading] = React.useState(false);
  const [usrImageError, setUsrImageError] = useState(null);
  const [fnameError, setfnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [mnameError, setmnameError] = useState("");
  const [lnameError, setlnameError] = useState("");
  const [cityError, setcityError] = useState("");
  const [countryError, setcountryError] = useState("");
  const [stateError, setstateError] = useState("");
  const [postalcodeError, setpostalcodeError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [bdateError, setbdateError] = useState("");
  const [usernameError, setusernameError] = useState("");
  const [roleError, setroleError] = useState("");
  const [orgidError, setorgidError] = useState("");

  function onPressRadioButton(radioButtonsArray) {
    setRadioButtons(radioButtonsArray);
    const value = radioButtons.find(
      (radioButtons) => radioButtons.selected
    )?.value;
    setGender(value);
  }

  const onChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setbdate(selectedDate);
  };

  const clearAll = () => {
    setfname("");
    setmname("");
    setlname("");
    setcity("");
    setcountry("");
    setstate("");
    setstate("");
    setpostalcode("");
    setPhoneNumber("");
    setEmail("");
    setGender("");
    setbdate("");
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
      Role: selectrole,
      Subrole: selectsubrole,
      Country: country,
      City: city,
      State: state,
      Postalcode: postalcode,
      Phonenumber: phoneNumber,
      Email: email,
      Gender: gender,
      Birthdate: bdate.toLocaleDateString(),
      UserName: email,
      Password: password,
      OrganizationID: orgid,
      UserImage: firebaseImageUrl,
      Storie: null,
      isAllowed: false,
    })
      .then(() => {
        navigation.replace("Start_Screen");
        alert(
          "Successfully registered",
          "Log in credential will be provided by your admin through email functionallity"
        );
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
        console.log(result.assets[0].uri);
      }
    });
  };

  const picupload = async (uid) => {
    let result = await fetch(usrImage);
    const blobImage = await result.blob();
    const filename = usrImage.substring(usrImage.lastIndexOf("/") + 1);
    const storageRef = ref(storage, "USRPIC/" + filename);
    const uploadTask = uploadBytesResumable(storageRef, blobImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        Alert.alert("Failed to upload", "Please try again..");
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
        console.log(errorMessage);
      });
  };

  const handleSubmit = () => {
    let emailEr = false;
    let userImageEr = false;
    let passwordEr = false;
    let fnameEr = false;
    let mnameEr = false;
    let lnameEr = false;
    let selectsubroleEr = false;
    let cityEr = false;
    let countryEr = false;
    let stateEr = false;
    let postalcodeEr = false;
    let phoneNumberER = false;
    let genderEr = false;
    let bdateEr = false;
    let orgidEr = false;

    if (!usrImage) {
      userImageEr = true;
      setUsrImageError("Please set your image");
    } else {
      userImageEr = false;
      setUsrImageError("");
    }
    if (!email) {
      emailEr = true;
      setusernameError("Please enter your username");
    } else {
      if (!/\S+@\S+\.\S+/.test(email)) {
        emailEr = true;
        setusernameError("please enter vaild email");
      } else {
        emailEr = false;
        setusernameError("");
      }
    }
    if (!email) {
      emailEr = true;
      setEmailError("Please enter your email");
    } else {
      if (!/\S+@\S+\.\S+/.test(email)) {
        emailEr = true;
        setEmailError("please enter vaild email");
      } else {
        emailEr = false;
        setEmailError("");
      }
    }
    if (!password) {
      passwordEr = true;
      setPasswordError("Please enter your password");
    } else {
      if (password.length < 6) {
        passwordEr = true;
        setPasswordError("Password must be of 6 length");
      } else {
        passwordEr = false;
        setPasswordError("");
      }
    }
    if (!fname) {
      fnameEr = true;
      setfnameError("Please enter your first name  ");
    } else {
      fnameEr = false;
      setfnameError("");
    }
    if (!mname) {
      mnameEr = true;
      setmnameError("Please enter your middle name ");
    } else {
      mnameEr = false;
      setmnameError("");
    }
    if (!lname) {
      lnameEr = true;
      setlnameError("Please enter your last name ");
    } else {
      lnameEr = false;
      setlnameError("");
    }
    if (!selectsubrole) {
      selectsubroleEr = true;
      setroleError("Please enter your role ");
    } else {
      selectsubroleEr = false;
      setroleError("");
    }
    if (!city) {
      cityEr = true;
      setcityError("Please enter your city name ");
    } else {
      cityEr = false;
      setcityError("");
    }
    if (!country) {
      countryEr = true;
      setcountryError("Please enter your country name ");
    } else {
      countryEr = false;
      setcountryError("");
    }
    if (!state) {
      stateEr = true;
      setpostalcodeError("Please enter your postal code ");
    } else {
      stateEr = false;
      setpostalcodeError("");
    }
    if (!postalcode) {
      postalcodeEr = true;
      setstateError("Please enter your state name ");
    } else {
      postalcodeEr = false;
      setstateError("");
    }
    if (!phoneNumber) {
      phoneNumberER = true;
      setPhoneNumberError("Please enter your moible no");
    } else if (phoneNumber.length < 10) {
      phoneNumberER = true;
      setPhoneNumberError("please provide 10 digits");
    } else {
      phoneNumberER = false;
      setPhoneNumberError("");
    }
    if (!gender) {
      genderEr = true;
      setGenderError("Please enter your gender ");
    } else {
      genderEr = false;
      setGenderError("");
    }
    if (!bdate) {
      bdateEr = true;
      setbdateError("Please enter your birth date ");
    } else {
      bdateEr = false;
      setbdateError("");
    }
    if (!orgid) {
      orgidEr = true;
      setorgidError("Please enter your org id ");
    } else {
      orgidEr = false;
      setorgidError("");
    }

    if (
      !(
        emailEr ||
        userImageEr ||
        passwordEr ||
        fnameEr ||
        mnameEr ||
        lnameEr ||
        selectsubroleEr ||
        cityEr ||
        countryEr ||
        stateEr ||
        postalcodeEr ||
        phoneNumberER ||
        genderEr ||
        bdateEr ||
        orgidEr
      )
    ) {
      Registration();
    }

    // it is red line validation ...
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View>
        <View style={[styles.heading, styles.center]}>
          <Text style={styles.headingtext}>User Registration </Text>
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
          {usrImageError && <Text style={styles.error}>{usrImageError}</Text>}
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
            style={[orgidError && styles.inputError]}
            lable="Organization ID :"
            onChangeText={(text) => setorgid(text)}
            keyboardType="number-pad"
            value={orgid}
            //error={errors.name}
          />
          {orgidError ? <Text style={styles.error}>{orgidError}</Text> : null}
          {/* <View style={styles.twobox}> */}
          <LbInputBox
            style={[fnameError && styles.inputError]}
            lable="First name :"
            onChangeText={(text) => setfname(text)}
            value={fname}
            // error={errors.fname}
            //onChangeText={text => fnameChange(text, 'fname')}
            //onFocus={() => handleError(null, 'fname')
          />
          {fnameError ? <Text style={styles.error}>{fnameError}</Text> : null}
          <LbInputBox
            style={[mnameError && styles.inputError]}
            lable="Middle name :"
            onChangeText={(text) => setmname(text)}
            value={mname}
          />
          {mnameError ? <Text style={styles.error}>{mnameError}</Text> : null}
          {/* </View> */}
          <LbInputBox
            style={[lnameError && styles.inputError]}
            lable="Last name :"
            onChangeText={(text) => setlname(text)}
            value={lname}
          />
          {lnameError ? <Text style={styles.error}>{lnameError}</Text> : null}
          {/* <View style={styles.twobox}> */}
          <View style={styles.picker}>
            <Text style={styles.lable}>who are you</Text>
            <Picker
              style={styles.innerpicker}
              selectedValue={selectrole}
              onValueChange={(itemValue, itemIndex) => setselectrole(itemValue)}
            >
              <Picker.Item label="Leader" value="leader" />
              <Picker.Item label="Employee" value="employee" />
            </Picker>
          </View>

          {selectrole === "leader" && (
            <View style={styles.picker}>
              <Text style={styles.lable}>
                what is your role in organization :
              </Text>
              <Picker
                style={styles.innerpicker}
                selectedValue={selectsubrole}
                onValueChange={(itemValue, itemIndex) =>
                  setselectsubrole(itemValue)
                }
              >
                <Picker.Item label="Manager" value="Manager" />
                <Picker.Item label="Executive" value="Executive" />
                <Picker.Item label="HR Manager" value="HR Manager" />
                <Picker.Item label="Department Head" value="Department Head" />
                <Picker.Item label="Sales Manager" value="Sales Manager" />
                <Picker.Item label="Team Leader" value="Team Leader" />
                <Picker.Item
                  label="Production Manager"
                  value="Production Manager"
                />
                <Picker.Item
                  label="Quality Control Manager"
                  value="Quality Control Manager"
                />
                <Picker.Item
                  label="Research and Development Manager"
                  value="Research and Development Manager"
                />
                <Picker.Item
                  label="Training and Development Manager"
                  value="Training and Development Manager"
                />
                <Picker.Item
                  label="Supply Chain Manager"
                  value="Supply Chain Manager"
                />
                <Picker.Item
                  label="Information Technology Manager"
                  value="Information Technology Manager"
                />
                <Picker.Item
                  label="Facilities Manager"
                  value="Facilities Manager"
                />
              </Picker>
            </View>
          )}

          {selectrole === "employee" && (
            <View style={styles.picker}>
              <Text style={styles.lable}>
                what is your role in organization :
              </Text>
              <Picker
                style={styles.innerpicker}
                selectedValue={selectsubrole}
                onValueChange={(itemValue, itemIndex) =>
                  setselectsubrole(itemValue)
                }
              >
                <Picker.Item label="UX Designer" value="UX Designer" />
                <Picker.Item label="UI Designer" value="UI Designer" />
                <Picker.Item
                  label="Front-End Developer"
                  value="Front-End Developer"
                />
                <Picker.Item
                  label="Back-End Developer"
                  value="Back-End Developer"
                />
                <Picker.Item
                  label="Full-Stack Developer"
                  value="Full-Stack Developer"
                />
                <Picker.Item
                  label="Mobile App Developer"
                  value="Mobile App Developer"
                />
                <Picker.Item
                  label="Database Administrator"
                  value="Database Administrator"
                />
                <Picker.Item
                  label="Network Administrator"
                  value="Network Administrator"
                />
                <Picker.Item
                  label="Systems Administrator"
                  value="Systems Administrator"
                />
                <Picker.Item
                  label="Business Analyst"
                  value="Business Analyst"
                />
                <Picker.Item label="Data Analyst" value="Data Analyst" />
                <Picker.Item
                  label="Graphic Designer"
                  value="Graphic Designer"
                />
                <Picker.Item
                  label="Sales Representative"
                  value="Sales Representative"
                />
                <Picker.Item
                  label="Customer Service Representative"
                  value="Customer Service Representative"
                />
                <Picker.Item
                  label="Administrative Assistant"
                  value="Administrative Assistant"
                />
                <Picker.Item
                  label="Human Resources Assistant"
                  value="Human Resources Assistant"
                />
                <Picker.Item label="Accountant" value="Accountant" />
                <Picker.Item
                  label="Marketing Coordinator"
                  value="Marketing Coordinator"
                />
                <Picker.Item
                  label="Operations Coordinator"
                  value="Operations Coordinator"
                />
                <Picker.Item label="Content Writer" value="Content Writer" />
                <Picker.Item
                  label="Social Media Manager"
                  value="Social Media Manager"
                />
                <Picker.Item
                  label="IT Support Technician"
                  value="IT Support Technician"
                />
                <Picker.Item
                  label="Logistics Coordinator"
                  value="Logistics Coordinator"
                />
                <Picker.Item
                  label="Research Assistant"
                  value="Research Assistant"
                />
                <Picker.Item
                  label="Event Coordinator"
                  value="Event Coordinator"
                />
                <Picker.Item
                  label="Quality Assurance Tester"
                  value="Quality Assurance Tester"
                />
              </Picker>
            </View>
          )}
          {roleError ? <Text style={styles.error}>{roleError}</Text> : null}

          <LbInputBox
            style={[countryError && styles.inputError]}
            lable="Country :"
            onChangeText={(text) => setcountry(text)}
            value={country}
          />
          {countryError ? (
            <Text style={styles.error}>{countryError}</Text>
          ) : null}
          <LbInputBox
            style={[stateError && styles.inputError]}
            lable="State / Region :"
            onChangeText={(text) => setstate(text)}
            value={state}
          />
          {stateError ? <Text style={styles.error}>{stateError}</Text> : null}
          <LbInputBox
            style={[cityError && styles.inputError]}
            lable="City :"
            onChangeText={(text) => setcity(text)}
            value={city}
          />
          {cityError ? <Text style={styles.error}>{cityError}</Text> : null}
          {/* </View> */}
          {/* <View style={styles.twobox}> */}
          <LbInputBox
            lable="Postal code :"
            style={[stateError && styles.inputError]}
            onChangeText={(text) => setpostalcode(text)}
            keyboardType="numeric"
            value={postalcode}
          />
          {postalcodeError ? (
            <Text style={styles.error}>{postalcodeError}</Text>
          ) : null}
          {/* </View> */}
          <LbInputBox
            style={[phoneNumberError && styles.inputError]}
            lable="Phone number :"
            inputMode="decimal"
            maxLength={10}
            onChangeText={(text) => setPhoneNumber(text)}
            value={phoneNumber}
          />
          {phoneNumberError ? (
            <Text style={styles.error}>{phoneNumberError}</Text>
          ) : null}
          <LbInputBox
            style={[emailError && styles.inputError]}
            lable="E-mail :"
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoComplate="email"
            autoCapitalize="none"
            value={email}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
          {/* <LbInputBox
            style={[genderError && styles.inputError]}
            lable="Gender :"
            onChangeText={(text) => setGender(text)}
            value={gender}
          /> */}
          <Text style={styles.lable}>Gender :</Text>
          <View
            style={{ alignItems: "center", marginVertical: moderateScale(8) }}
          >
            <RadioGroup
              layout="row"
              radioButtons={radioButtons}
              onPress={onPressRadioButton}
            />
          </View>
          {genderError ? <Text style={styles.error}>{genderError}</Text> : null}
          <Pressable onPress={() => setShowDatePicker(true)}>
            <LbInputBox
              style={[bdateError && styles.inputError]}
              textStyle={{ textAlign: "center" }}
              lable="Birth date :"
              value={bdate.toLocaleDateString()}
              iconName={"calendar-outline"}
              editable={false}
            />
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={new Date(bdate)}
              mode={"date"}
              is24Hour={true}
              onChange={onChange}
            />
          )}
          {bdateError ? <Text style={styles.error}>{bdateError}</Text> : null}
          <LbInputBox
            style={[usernameError && styles.inputError]}
            lable="UserName :"
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoComplate="email"
            autoCapitalize="none"
            value={email}
          />
          {usernameError ? (
            <Text style={styles.error}>{usernameError}</Text>
          ) : null}
          <LbInputBox
            style={[passwordError && styles.inputError]}
            lable="Password :"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}
        </View>

        <MyButton
          title="Register"
          style={styles.btn}
          fontStyle={styles.fontstyle}
          onPress={() => handleSubmit()}
        />
        <MyButton
          title="Clear All"
          style={styles.btn}
          fontStyle={styles.fontstyle}
          onPress={() => clearAll()}
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
