import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";

import { Video, AVPlaybackStatus } from "expo-av";
import FitImage from "react-native-fit-image";
import DocumentView from "./DocumentView";

import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

import * as OpenAnything from "react-native-openanything";

import { ActivityIndicator } from "react-native";

import { Colors } from "../Assets/Colors/Colors";
import alert from "../Utills/alert";
import { useNavigation } from "@react-navigation/native";
import Stories from "./Stories";

import * as Animatable from "react-native-animatable";

import { db, auth, storage } from "../db/firebaseConfig";
import {
  doc,
  deleteDoc,
  query,
  onSnapshot,
  collectionGroup,
  where,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyButton from "./MyButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const PostView = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData(orgId);
    setRefreshing(false);
  };

  useLayoutEffect(() => {
    const id = AsyncStorage.getItem("orgId")
      .then((id) => {
        setOrgId(id);
        fetchData(id);
      })
      .catch((e) => console.log(e));
  }, []);

  const fetchData = async (id) => {
    const postQuery = query(
      collectionGroup(db, "posts"),
      where("orgId", "==", id.toString()),
      orderBy("createdAt", "asc")
    );
    onSnapshot(postQuery, (post) => {
      setData(
        post.docs
          .map((post) => ({
            id: post.id,
            data: post.data(),
          }))
          .reverse()
      );
    });
    setIsLoading(false);
  };

  return isLoading ? (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color={Colors.primaryColor200} />
    </View>
  ) : (
    <>
      <View style={{ flex: 1, zIndex: -2 }}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item, index }) => (
            <Post
              data={item.data}
              index={index}
              postId={item.id}
              orgId={orgId}
              style={{ zIndex: -1 }}
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                marginVertical: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FitImage
                source={require("../Assets/Img/empty-box.png")}
                resizeMode="stretch"
                style={{ width: 150, height: 150 }}
              />
              <Text>No post available to display</Text>
            </View>
          }
          ListHeaderComponent={
            <View>
              <Text
                style={{
                  fontSize: scale(20),
                  paddingHorizontal: 10,
                  fontWeight: "bold",
                }}
              >
                Stories :
              </Text>
              <Stories />
              <Text
                style={{
                  fontSize: scale(20),
                  paddingHorizontal: 10,
                  fontWeight: "bold",
                }}
              >
                Post :
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
};

export default PostView;

const Post = ({ data, postId, orgId, index }) => {
  const postRef = doc(
    db,
    "organization",
    orgId,
    "users",
    data.userId,
    "posts",
    postId
  );

  const deletePost = async () => {
    try {
      // delete the document using the deleteDoc function
      await deleteDoc(postRef);
      //if user only uploaded caption(text) then we dont have to delete any file from storage.
      if (data.fileType != null) {
        const fileRef = ref(storage, data.URL);
        await deleteObject(fileRef).then(() =>
          alert("Post deleted", "Your post has been deleted")
        );
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
              source={{ uri: data.userimage }}
              resizeMode="cover"
              style={styles.profilepicture}
            />

            <Text style={styles.name}>{data.username}</Text>
          </View>
          {data.userId == auth.currentUser.uid && (
            <TouchableOpacity
              onPress={(postRef, url = data.URL) =>
                alert(
                  "Delete post",
                  "Are you sure you want to delete this suggestion? This action cannot be undone.",
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
        <View style={styles.postcaption}>
          {/* <Text style={{ fontWeight: "bold", fontSize: scale(16) }}>
            Description :
          </Text> */}
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
        {data.fileType && (
          <View style={styles.postcontent}>
            {data.fileType.split("/")[0] === "image" && (
              <FitImage source={{ uri: data.URL }} resizeMode="cover" />
            )}
            {data.fileType.split("/")[0] === "document" && (
              <TouchableOpacity
                onPress={() => {
                  OpenAnything.Pdf(data.URL);
                  // navigation.navigate("DocumentViewer_Screen", { url: data.URL });
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
                useNativeControls
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
              {/* <Ionicons
                name="thumbs-up-outline"
                size={moderateScale(25)}
                color={
                  data.likes.includes(auth.currentUser.uid)
                    ? "#9000ff"
                    : "black"
                }
              /> */}
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

const styles = StyleSheet.create({
  post: {
    margin: moderateVerticalScale(10),
    borderRadius: moderateScale(20),
    backgroundColor: "#f8f8f8",
    elevation: 3.5,
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
