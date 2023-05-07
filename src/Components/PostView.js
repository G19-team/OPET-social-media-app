import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";

import { Video, AVPlaybackStatus } from "expo-av";
import FitImage from "react-native-fit-image";
import DocumentView from "./DocumentView";

import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

import * as OpenAnything from "react-native-openanything";

import { Colors } from "../Assets/Colors/Colors";
import alert from "../Utills/alert";
import { useNavigation } from "@react-navigation/native";

import * as Animatable from "react-native-animatable";

import { db, auth, storage } from "../db/firebaseConfig";
import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PostView = ({ data, postId, orgId, index, role }) => {
  const [usrDataImage, setUsrDataImage] = useState();
  const [usrDataName, setUsrDataName] = useState();
  const postRef = doc(
    db,
    "organization",
    orgId,
    "users",
    data.userId,
    "posts",
    postId
  );

  useLayoutEffect(() => {
    const unsub = onSnapshot(
      doc(db, "organization", orgId, "users", data.userId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setUsrDataImage(data.UserImage);
          setUsrDataName(data.Firstname + " " + data.Lastname);
        }
      }
    );
  }, []);

  const deletePost = async () => {
    try {
      // delete the document using the deleteDoc function
      await deleteDoc(postRef);
      //if user only uploaded caption(text) then we dont have to delete any file from storage.
      if (data.fileType != null) {
        const fileRef = ref(storage, data.URL);
        await deleteObject(fileRef);
      } else {
        alert("Post deleted", "Your post has been deleted");
      }
    } catch (error) {
      alert("Error!", "Your post cant be deleted because of some reason");
    }
  };

  const likeThePost = async () => {
    const likeStatus = data.likes.includes(auth.currentUser.uid);
    const dislikeStatus = data.dislikes.includes(auth.currentUser.uid);
    //If user disliked the post then remove it.
    if (dislikeStatus == true) {
      await updateDoc(postRef, { dislikes: arrayRemove(auth.currentUser.uid) });
    }

    await updateDoc(
      postRef,
      likeStatus
        ? { likes: arrayRemove(auth.currentUser.uid) }
        : { likes: arrayUnion(auth.currentUser.uid.toString()) }
    );
  };

  const dislikeThePost = async () => {
    if (role === "leader") {
      const likeStatus = data.likes.includes(auth.currentUser.uid);
      const dislikeStatus = data.dislikes.includes(auth.currentUser.uid);
      //if user liked the post then remove it
      if (likeStatus == true) {
        await updateDoc(postRef, { likes: arrayRemove(auth.currentUser.uid) });
      }

      await updateDoc(
        postRef,
        dislikeStatus
          ? { dislikes: arrayRemove(auth.currentUser.uid) }
          : { dislikes: arrayUnion(auth.currentUser.uid.toString()) }
      );
    } else {
      alert(
        "Disliking Not Available for Employees",
        "As an employee, you do not have the option to dislike posts"
      );
    }
  };

  const navigation = useNavigation();
  return (
    <>
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        delay={index * 110}
        style={styles.post}
      >
        <View style={styles.postheader}>
          <View style={styles.postinfo}>
            <Image
              source={{ uri: usrDataImage }}
              resizeMode="cover"
              style={styles.profilepicture}
            />

            <Text style={styles.name}>{usrDataName && usrDataName}</Text>
          </View>
          {data.userId === auth.currentUser.uid && (
            <TouchableOpacity
              onPress={(postRef, url = data.URL) =>
                alert(
                  "Delete post",
                  "Are you sure you want to delete this post? This action cannot be undone.",
                  [
                    {
                      text: "Yes",
                      onPress: () => deletePost(postRef, url),
                    },
                    { text: "No", style: "cancel" },
                  ]
                )
              }
            >
              <Icon
                name="trash-can-outline"
                size={moderateScale(24)}
                color="red"
              />
            </TouchableOpacity>
          )}
        </View>
        {data.caption && (
          <View style={styles.postcaption}>
            <Text
              style={{
                opacity: 10.7,
                includeFontPadding: true,
                fontSize: moderateScale(14),
              }}
            >
              {data.caption}
            </Text>
          </View>
        )}
        {data.fileType && (
          <View style={styles.postcontent}>
            {data.fileType.split("/")[0] === "image" && (
              <FitImage source={{ uri: data.URL }} resizeMode="cover" />
            )}
            {data.fileType.split("/")[0] === "document" && (
              <TouchableOpacity
                onPress={() => {
                  OpenAnything.Pdf(data.URL);
                }}
              >
                <DocumentView
                  type={data.fileType.split("/").slice(1).join("/")}
                  name={data.fileName}
                  // size={200000}
                />
              </TouchableOpacity>
            )}
            {data.fileType.split("/")[0] === "video" && (
              <Video
                style={{ height: 250 }}
                resizeMode="contain"
                source={{
                  uri: data.URL,
                }}
                useNativeControls={true}
              />
            )}
          </View>
        )}
        <View style={styles.postfooter}>
          <View style={styles.postoptions}>
            <TouchableOpacity
              style={[
                styles.options,
                {
                  backgroundColor: data.likes.includes(auth.currentUser.uid)
                    ? "#f7ebff"
                    : "#f8f8f8",
                  borderRadius: moderateScale(10),
                },
              ]}
              onPress={() => likeThePost()}
            >
              <Text
                style={{
                  color: data.likes.includes(auth.currentUser.uid)
                    ? "#ab3dff"
                    : "black",
                }}
              >
                {data.likes.length}{" "}
                {data.likes.length === 1 || data.likes.length === 0
                  ? "like"
                  : "likes"}
              </Text>

              <Icon
                name={
                  data.likes.includes(auth.currentUser.uid)
                    ? "thumb-up"
                    : "thumb-up-outline"
                }
                size={moderateScale(25)}
                color={
                  data.likes.includes(auth.currentUser.uid)
                    ? "#ab3dff"
                    : "black"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.options,
                {
                  backgroundColor: data.dislikes.includes(auth.currentUser.uid)
                    ? "#ffd5d5"
                    : "#f8f8f8",
                  borderRadius: moderateScale(10),
                },
              ]}
              onPress={() => dislikeThePost()}
            >
              <Text
                style={{
                  color: data.dislikes.includes(auth.currentUser.uid)
                    ? "red"
                    : "black",
                }}
              >
                {data.dislikes.length}
                {data.dislikes.length === 1 || data.dislikes.length === 0
                  ? " dislike"
                  : " dislikes"}
              </Text>
              {/* <Ionicons
                name="thumbs-down-outline"
                size={moderateScale(25)}
                color={
                  data.dislikes.includes(auth.currentUser.uid) ? "red" : "black"
                }
              /> */}
              <Icon
                name={
                  data.dislikes.includes(auth.currentUser.uid)
                    ? "thumb-down"
                    : "thumb-down-outline"
                }
                size={moderateScale(25)}
                color={
                  data.dislikes.includes(auth.currentUser.uid) ? "red" : "black"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.options}
              onPress={() =>
                navigation.push("Suggestion", {
                  postId: postId,
                  userId: data.userId,
                  orgId: orgId,
                  role: role,
                })
              }
            >
              <Text style={{ textAlign: "center" }}>
                {data.suggestions.length}{" "}
                {data.suggestions.length > 9 ? "sugge.." : "suggestion"}
              </Text>
              {/* <Ionicons name="chatbox-outline" size={moderateScale(25)} /> */}
              <Icon name="comment-outline" size={moderateScale(25)} />
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    </>
  );
};

export default PostView;

const styles = StyleSheet.create({
  post: {
    margin: moderateVerticalScale(10),
    borderRadius: moderateScale(20),
    backgroundColor: "#f8f8f8",
    elevation: 1,
    zIndex: -1,
  },
  postheader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
    justifyContent: "space-between",
  },
  postinfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilepicture: {
    width: moderateScale(45),
    height: moderateScale(45),
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: Colors.primaryColor500,
    borderRadius: moderateScale(30),
  },
  name: {
    marginLeft: moderateScale(8),
    fontWeight: "bold",
    fontSize: moderateScale(15),
  },
  postcontent: {
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(8),
    overflow: "hidden",
  },
  postfooter: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(15),
  },
  postoptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  options: {
    alignItems: "center",
    paddingVertical: moderateVerticalScale(5),
    width: "28%",
    overflow: "hidden",
  },
  postcaption: {
    paddingHorizontal: moderateScale(15),
    marginBottom: moderateVerticalScale(5),
    // marginTop: moderateVerticalScale(5),
  },
});
