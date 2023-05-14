import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import FitImage from "react-native-fit-image";
import { StatusBar } from "react-native";
import { moderateScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  uploadBytesResumable,
  getDownloadURL,
  ref,
  deleteObject,
} from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storage, auth, db } from "../../db/firebaseConfig";
import {
  updateDoc,
  doc,
  onSnapshot,
  collection,
  where,
  query,
} from "firebase/firestore";
import alert from "../../Utills/alert";

const StorieView_Screen = ({ route, navigation }) => {
  const storie = route.params.storie;
  const name = route.params.name;
  const uid = route.params.uid;

  const deleteStory = () => {
    const id = AsyncStorage.getItem("orgId").then(async (id) => {
      const imgRef = ref(storage, storie);
      deleteObject(imgRef);
      const userRef = doc(
        db,
        "organization",
        id,
        "users",
        auth.currentUser.uid
      );
      await updateDoc(userRef, { Storie: null }).then(() => {
        navigation.navigate("Home_Screen");
        alert("Story is deleted", "Your story has been deleted");
      });
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={"#252525"} />

      <View
        style={{
          padding: moderateScale(15),
          borderBottomColor: "#ffffff",
          borderBottomWidth: 1,
          width: "100%",
          position: "absolute",
          top: 0,
          flexDirection: "row",
          justifyContent:
            uid === auth.currentUser.uid ? "space-between" : "flex-start",
          zIndex: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home_Screen");
          }}
        >
          <Icon name="arrow-left" size={moderateScale(25)} color={"#ffffff"} />
        </TouchableOpacity>
        <Text
          style={{
            color: "#ffffff",
            fontSize: moderateScale(15),
            fontWeight: "bold",
            marginLeft: moderateScale(15),
          }}
        >
          {name}
        </Text>

        {uid === auth.currentUser.uid && (
          <TouchableOpacity
            onPress={() =>
              alert("Warning!", "Do you want to delete this story", [
                {
                  text: "Yes",
                  onPress: () => deleteStory(),
                },
                {
                  text: "No",
                },
              ])
            }
          >
            <Icon
              name="trash-can-outline"
              size={moderateScale(25)}
              color={"red"}
            />
          </TouchableOpacity>
        )}
      </View>

      <View>
        <Image
          source={{ uri: storie }}
          resizeMode="contain"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>
    </View>
  );
};

export default StorieView_Screen;
