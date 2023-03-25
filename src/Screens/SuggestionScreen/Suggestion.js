import { FlatList, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { Button, TextInput } from "react-native-paper";
import alert from "../../Utills/alert";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db, auth } from "../../db/firebaseConfig";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { Colors } from "../../Assets/Colors/Colors";

const Suggestion = ({ route }) => {
  const orgId = route.params.orgId;
  const userId = route.params.userId;
  const postId = route.params.postId;

  const [suggestion, setSuggestion] = useState(null);
  const [data, setData] = useState(null);
  const postRef = doc(
    db,
    "organization",
    orgId,
    "users",
    userId,
    "posts",
    postId
  );

  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(postRef, (docSnapshot) => {
      const field = docSnapshot.data().suggestions;
      setData(
        field.map((data, index) => ({
          id: index,
          postId: data.postId,
          senderId: data.senderId,
          receiverId: data.receiverId,
          suggestion: data.suggestion,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const sendSuggestion = async () => {
    if (!suggestion) {
      alert("Warning!", "Please enter data");
    } else {
      await updateDoc(postRef, {
        suggestions: arrayUnion({
          postId: postId,
          receiverId: userId,
          senderId: auth.currentUser.uid,
          suggestion: suggestion.toString(),
        }),
      }).then(() => setSuggestion(null));
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 110 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          inverted
          data={data}
          keyExtractor={(data) => data.id}
          renderItem={({ item }) => (
            <DisplaySuggestion data={item} orgId={orgId} userId={userId} />
          )}
        />
      </View>
      <View style={{ position: "absolute", bottom: 5, width: "100%" }}>
        <TextInput
          mode="outlined"
          placeholder="Give your suggestion"
          style={{ borderRadius: 20 }}
          multiline={true}
          onChangeText={(data) => setSuggestion(data)}
          value={suggestion}
        />
        <Button
          mode="contained"
          style={{ backgroundColor: "#E0BAFD", marginTop: 10 }}
          onPress={() => sendSuggestion()}
        >
          Suggest
        </Button>
      </View>
    </View>
  );
};

export default Suggestion;

const DisplaySuggestion = ({ data, orgId, userId, index }) => {
  const postRef = doc(
    db,
    "organization",
    orgId,
    "users",
    userId,
    "posts",
    data.postId
  );
  const userRef = doc(db, "organization", orgId, "users", data.senderId);

  const [userData, setUserData] = useState("");

  useLayoutEffect(() => {
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setUserData({
          usrName: userData.Firstname + " " + userData.Lastname,
          usrImage: userData.UserImage,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const sgn = {
    postId: data.postId,
    receiverId: data.receiverId,
    senderId: data.senderId,
    suggestion: data.suggestion,
  };

  const deleteSuggestion = async () => {
    await updateDoc(postRef, { suggestions: arrayRemove(sgn) })
      .then(() => alert("Deleted", "suggestion has been deleted"))
      .catch((e) => alert("Error!", "Something went wrong"));
  };

  return (
    <>
      <TouchableOpacity
        disabled={data.senderId != auth.currentUser.uid}
        style={{
          flexDirection:
            data.senderId == auth.currentUser.uid ? "row-reverse" : "row",
          alignItems: "center",
          marginVertical: moderateVerticalScale(10),
        }}
        onLongPress={() =>
          alert(
            "Delete suggestion",
            "Are you sure you want to delete this suggestion? This action cannot be undone.",
            [
              {
                text: "Yes",
                onPress: () => deleteSuggestion(),
              },
              { text: "No", style: "cancel" },
            ]
          )
        }
      >
        <Image
          source={{ uri: userData.usrImage }}
          resizeMode="contain"
          style={{
            width: moderateScale(40),
            height: moderateVerticalScale(40),
            borderRadius: moderateScale(20),
          }}
        />
        <View
          style={{
            marginLeft: moderateScale(15),
            marginRight: moderateScale(15),
            borderWidth: 1,
            borderRadius: moderateScale(9),
            width: "65%",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              backgroundColor:
                data.senderId == auth.currentUser.uid
                  ? Colors.primaryColor500
                  : "#d9d9d9",
              paddingVertical: moderateVerticalScale(5),
              paddingHorizontal: moderateScale(10),
            }}
          >
            <Text
              style={{
                fontSize: moderateScale(15),
                fontWeight: 600,
                color:
                  data.senderId == auth.currentUser.uid ? "#ffffff" : "#000000",
              }}
            >
              {userData.usrName}
            </Text>
          </View>
          <View
            style={{
              paddingVertical: moderateVerticalScale(5),
              paddingHorizontal: moderateScale(10),
            }}
          >
            <Text>{data.suggestion}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
