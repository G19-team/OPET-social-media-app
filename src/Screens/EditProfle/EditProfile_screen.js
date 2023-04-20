import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useTheme } from "react-native-paper";
// install this pkg for customizable -->
//npm i react-native-paper

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

//plse install and import react-native-vector-icons/MaterialCommunityIcons

import FontAwesome from "react-native-vector-icons/FontAwesome";

//plse install and import react-native-vector-icons/FontAwesome

import Feather from "react-native-vector-icons/Feather";

//plse install and impor react-native-vector-icons/FontAwesom

import BottomSheet from "reanimated-bottom-sheet";

//plse install buttom sheet pakage and import

// install this pkg for btm sheet -->
//npm install reanimated-bottom-sheet

import Animated from "react-native-reanimated";

//plse install animated pakage and import

import * as ImagePicker from "expo-image-picker";

import { KeyboardAvoidingView } from "react-native";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../db/firebaseConfig";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { ActivityIndicator } from "react-native";
import { Colors } from "../../Assets/Colors/Colors";
import alert from "../../Utills/alert";

//plse install ImagePicke pakage and import

const EditProfile_Screen = ({ navigation }) => {
  const [image, setImage] = useState(
    "https://aniportalimages.s3.amazonaws.com/media/details/1639049711050_12021122709484420211227101334.jpg"
  );
  const { colors } = useTheme();

  const [fname, setfname] = useState(null);
  const [mname, setmname] = useState(null);
  const [lname, setlname] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [city, setcity] = useState(null);
  const [country, setcountry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    const id = AsyncStorage.getItem("orgId").then((id) => {
      fetchData(id);
    });
  }, []);

  const fetchData = async (id) => {
    const docRef = doc(db, "organization", id, "users", auth.currentUser.uid);
    const snap = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setImage(data.UserImage);
        setfname(data.Firstname);
        setmname(data.Middlename);
        setlname(data.Lastname);
        setPhoneNumber(data.Phonenumber);
        setEmail(data.Email);
        setcity(data.City);
        setcountry(data.Country);
      } else {
        console.log("No such document!");
      }
    });
  };

  const update = (firebaseImageUrl) => {
    const orgid = AsyncStorage.getItem("orgId").then(async (orgId) => {
      const docRef = doc(
        db,
        "organization",
        orgId,
        "users",
        auth.currentUser.uid
      );

      await updateDoc(docRef, {
        Firstname: fname.toLowerCase(),
        Middlename: mname.toLowerCase(),
        Lastname: lname.toLowerCase(),
        Country: country,
        City: city,
        Phonenumber: phoneNumber,
        Email: email,
        UserImage: firebaseImageUrl,
      }).then(() => {
        alert(
          "Successfully update !",
          "Your profile has been updated successfully."
        );
      });
      setIsLoading(false);
    });
  };

  const picupload = async () => {
    if (
      !image ||
      !fname ||
      !mname ||
      !lname ||
      !phoneNumber ||
      !email ||
      !city ||
      !country
    ) {
      alert("Not permitted", "Please enter all above fields.");
      setIsLoading(false);
      return 0;
    }
    setIsLoading(true);
    let result = await fetch(image);

    const blobImage = await result.blob();
    const filename = image.substring(image.lastIndexOf("/") + 1);
    const storageRef = ref(storage, "USRPIC/" + filename);
    const uploadTask = uploadBytesResumable(storageRef, blobImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        alert("Failed to upload", "Please try again..");
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          update(downloadURL);
        });
      }
    );
  };

  const choosePhotoFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
    }).then((result) => {
      setImage(result.assets[0].uri);
      this.bs.current.snapTo(1);
    });
  };

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}> Change Your Profile Pic </Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <TouchableOpacity
        style={styles.panelButton}
        //onPress={choosePhotoFromLibrary}
        onPress={choosePhotoFromLibrary}
      >
        <Text style={styles.panelButtonTitle}>Choose From Library</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.bs.current.snapTo(1)}
      >
        <Text style={styles.panelButtonTitle}> cancele</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  bs = React.createRef();
  fall = new Animated.Value(1);

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <BottomSheet
        ref={this.bs}
        snapPoints={[330, 0]}
        renderContent={this.renderInner}
        renderHeader={this.renderHeader}
        initialSnap={1}
        callbackNode={this.fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
        }}
      >
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageBackground
                source={
                  image
                    ? { uri: image }
                    : {
                        uri: "https://aniportalimages.s3.amazonaws.com/media/details/1639049711050_12021122709484420211227101334.jpg",
                      }
                }
                style={{ height: 100, width: 100 }}
                imageStyle={{ borderRadius: 15 }}
              >
                {image && (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon
                      name="camera"
                      size={35}
                      color="#fff"
                      style={{
                        opacity: 0.7,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: "#fff",
                        borderRadius: 10,
                      }}
                    />
                  </View>
                )}
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            {fname} {mname} {lname}
          </Text>
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Enter your First Name"
            placeholderTextColor="#666666"
            onChangeText={(text) => setfname(text)}
            autoCorrect={false}
            value={fname}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Enter your Middle Name"
            placeholderTextColor="#666666"
            onChangeText={(text) => setmname(text)}
            autoCorrect={false}
            value={mname}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Enter your Last Name"
            placeholderTextColor="#666666"
            onChangeText={(text) => setlname(text)}
            autoCorrect={false}
            value={lname}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>
        <View style={styles.action}>
          <Feather name="phone" color={colors.text} size={20} />
          <TextInput
            placeholder=" Enter your Phone no"
            placeholderTextColor="#666666"
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="number-pad"
            autoCorrect={false}
            value={phoneNumber}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="envelope-o" color={colors.text} size={20} />
          <TextInput
            placeholder=" Enter your Email"
            placeholderTextColor="#666666"
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCorrect={false}
            value={email}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="globe" color={colors.text} size={20} />
          <TextInput
            placeholder=" Enter your Country"
            placeholderTextColor="#666666"
            onChangeText={(text) => setcountry(text)}
            autoCorrect={false}
            value={country}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>
        <View style={styles.action}>
          <Icon name="map-marker-outline" color={colors.text} size={20} />
          <TextInput
            placeholder="Enter your City"
            placeholderTextColor="#666666"
            onChangeText={(text) => setcity(text)}
            autoCorrect={false}
            value={city}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View>
        {/* <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Enter your roll "
            placeholderTextColor="#666666"
            onChangeText={(text) => setroll(text)}
            autoCorrect={false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
          />
        </View> */}
        <TouchableOpacity
          style={styles.commandButton}
          onPress={() => picupload()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color={"#ffffff"} />
          ) : (
            <Text style={styles.panelButtonTitle}>update</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAwareScrollView>
  );
};
export default EditProfile_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.primaryColor500,
    //backgroundColor: " #FBBF77",
    alignItems: "center",
    marginTop: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,

    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    //backgroundColor: "#4169e1",
    backgroundColor: Colors.primaryColor500,
    //backgroundColor: " #FBBF77",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    // marginTop: Platform.OS === "web" ? 0 : -12,
    paddingLeft: 10,
    color: "#05375a",
  },
});
