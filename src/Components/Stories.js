import React, { useLayoutEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import users from "../../userList.json";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Colors } from "../Assets/Colors/Colors";

import { storage, auth, db } from "../db/firebaseConfig";
import {
  updateDoc,
  doc,
  onSnapshot,
  collection,
  where,
  query,
} from "firebase/firestore";
import alert from "../Utills/alert";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
const Stories = () => {
  const [storieData, setStroieData] = useState(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const id = AsyncStorage.getItem("orgId").then((id) => {
      const storieRef = collection(db, "organization", id, "users");
      const q = query(storieRef, where("Storie", "!=", null));
      // const storieSnap = onSnapshot(q, (docSnap) => {
      //   docSnap.forEach((data) => {
      //     console.log(data.data().Firstname + "=>" + data.data().Storie);
      //   });
      // });
      const storieSnap = onSnapshot(q, (docSnap) => {
        setStroieData(
          docSnap.docs.map((storie) => ({
            uid: storie.id,
            url: storie.data().Storie,
            userImage: storie.data().UserImage,
            firstName: storie.data().Firstname,
            middleName: storie.data().Middlename,
            lastName: storie.data().Lastname,
          }))
        );
      });
    });
  };

  const [image, setImage] = useState("");

  const PickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    }).then((result) => {
      if (!result?.canceled) {
        setImage(result.assets[0].uri);
        dbUploadFiles(
          result.assets[0].uri,
          result.assets[0].uri.substring(
            result.assets[0].uri.lastIndexOf("/") + 1
          )
        );
      }
    });
  };
  const dbUploadFiles = async (file, fileName) => {
    //convert any file to blob file code is below.
    let result = await fetch(file).catch((er) => console.log(er));
    const blobFile = await result.blob();

    //upload files to firebase code is below.
    const storageRef = ref(storage, "STORIE/" + fileName);

    const uploadTask = uploadBytesResumable(storageRef, blobFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        if ((snapshot.bytesTransferred / snapshot.totalBytes) * 100 == 100) {
          alert(
            "storie uploaded successfullly",
            "your storie has been successfully uploaded"
          );
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        // Alert.alert(
        //   "Failed to upload",
        //   "uploading task generated an error beacuse of some reasone"
        // );
        alert(
          "Failed to upload",
          "uploading task generated an error beacuse of some reasone"
        );

        setImage(null);
      },
      () => {
        // console.log(doc.data().Firstname);

        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateStorie(downloadURL);
        });
      }
    );
  };

  const updateStorie = async (url) => {
    AsyncStorage.getItem("orgId").then(async (orgId) => {
      const userRef = doc(
        db,
        "organization",
        orgId,
        "users",
        auth.currentUser.uid
      );
      await updateDoc(userRef, { Storie: url }).then(() => {
        console.log("successfully stroie uploaded");
      });
    });
  };

  return (
    <>
      <FlatList
        horizontal={true}
        data={storieData}
        style={styles.container}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("StorieView_Screen", {
                storie: item.url,
                name:
                  item.lastName + " " + item.firstName + " " + item.middleName,
                uid: item.uid,
              })
            }
          >
            <View style={styles.storiecontainer}>
              <View style={styles.setImage}>
                <Image
                  source={{ uri: item.userImage }}
                  style={[styles.setImage, { width: 85, height: 115 }]}
                />
              </View>
              <Text style={[styles.userName, { textTransform: "capitalize" }]}>
                {item.uid === auth.currentUser.uid
                  ? "Your story"
                  : item.firstName + " " + item.middleName}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.uid}
        ListHeaderComponent={
          <TouchableOpacity onPress={PickImage}>
            <View
              style={[
                styles.storiecontainer,
                { marginLeft: moderateScale(10) },
              ]}
            >
              <View style={styles.setImage}>
                <View style={styles.addbtnContainer}>
                  <Ionicons name="add" style={styles.addbtn} />
                </View>
              </View>
              <Text style={[styles.userName, { textTransform: "capitalize" }]}>
                You Story
              </Text>
            </View>
          </TouchableOpacity>
        }
      />
    </>
  );
};
export default Stories;

const styles = StyleSheet.create({
  container: {
    paddingVertical: moderateVerticalScale(10),
  },
  storiecontainer: {
    alignItems: "center",
    marginLeft: moderateScale(7),
    paddingHorizontal: moderateScale(5),
  },
  userImage: {
    width: 90,
    height: 120,
    borderRadius: 50,
    borderColor: Colors.primaryColor200,
    borderWidth: 1,
  },
  userName: {
    textAlign: "center",
    fontSize: 12,
    textTransform: "lowercase",
    margin: 5,
  },
  addbtnContainer: {
    backgroundColor: "#4c68d7",
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  addbtn: {
    color: "#ffffff",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
  },
  setImage: {
    borderRadius: 50,
    width: 90,
    height: 120,
    backgroundColor: Colors.primaryColor500,
    justifyContent: "center",
    alignItems: "center",
  },
});
