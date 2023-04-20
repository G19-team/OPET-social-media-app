import React, { useState, useEffect, useLayoutEffect } from "react";

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  SectionList,
} from "react-native";

import { Colors } from "../../Assets/Colors/Colors";
import { ActivityIndicator } from "react-native";

import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";

import {
  doc,
  getDoc,
  query,
  onSnapshot,
  collectionGroup,
  where,
  orderBy,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, auth, storage } from "../../db/firebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import FitImage from "react-native-fit-image";

import PostView from "../../Components/PostView";

const Profile_Screen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userdata, setUserData] = useState("");
  const [likes, setLikes] = useState(null);
  const [dislikes, setDisLikes] = useState(null);
  const [posts, setPosts] = useState(null);

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
    const docRef = doc(db, "organization", id, "users", auth.currentUser.uid);
    const snap = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
      } else {
        console.log("No such document!");
      }
    });

    const postRef = collection(
      db,
      "organization",
      id,
      "users",
      auth.currentUser.uid,
      "posts"
    );

    const unsubscribe = onSnapshot(postRef, async (querySnapshot) => {
      let newLikes = 0;
      let newDislikes = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newLikes += data.likes.length;
        newDislikes += data.dislikes.length;
      });
      setLikes(newLikes);
      setDisLikes(newDislikes);
      setPosts(querySnapshot.size);
    });

    const postQuery = query(
      collectionGroup(db, "posts"),
      where("orgId", "==", id.toString()),
      where("userId", "==", auth.currentUser.uid),
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

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
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
        <FlashList
          ref={ref}
          estimatedItemSize={463}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
            />
          }
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item, index }) => (
            <PostView
              data={item.data}
              index={index}
              role={userdata.Role}
              postId={item.id}
              orgId={orgId}
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
                source={require("../../Assets/Img/empty-box.png")}
                resizeMode="stretch"
                style={{ width: 150, height: 150 }}
              />
              <Text>No post available to display</Text>
            </View>
          }
          ListHeaderComponent={
            <>
              <View style={styles.container}>
                <Image
                  style={styles.userImg}
                  source={
                    userdata.UserImage
                      ? { uri: userdata.UserImage }
                      : require("../../Assets/Img/OPET_LOGO.png")
                  }
                />
                <Text style={styles.userName}>
                  {userdata.Lastname} {userdata.Firstname} {userdata.Middlename}
                </Text>
                <Text style={styles.aboutUser}> Role : {userdata.Role} </Text>
                <Text style={styles.aboutUser}>
                  Address: {userdata.City} {userdata.State} {userdata.Country}{" "}
                </Text>
                <Text style={styles.aboutUser}>
                  Contect number : {userdata.Phonenumber}{" "}
                </Text>
                <Text style={styles.aboutUser}> Email : {userdata.Email} </Text>
                <View style={styles.userBtnWrapper}>
                  <TouchableOpacity
                    style={styles.userBtn}
                    onPress={() => {
                      navigation.navigate("EditProfile_Screen");
                    }}
                  >
                    <Text style={styles.userBtnTxt}>Edit your profile</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.userInfoWrapper}>
                  <View style={styles.userInfoItem}>
                    <Text style={styles.userInfoTitle}>{posts}</Text>
                    <Text style={styles.userInfoSubTitle}>posts</Text>
                  </View>
                  <View style={styles.userInfoItem}>
                    <Text style={styles.userInfoTitle}>{likes}</Text>
                    <Text style={styles.userInfoSubTitle}>likes</Text>
                  </View>
                  <View style={styles.userInfoItem}>
                    <Text style={styles.userInfoTitle}>{dislikes}</Text>
                    <Text style={styles.userInfoSubTitle}>dislikes</Text>
                  </View>
                </View>
              </View>
              <View>
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
            </>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statName: {
    fontSize: 16,
    color: "gray",
  },
  text: {
    fontSize: 20,
    color: "#333333",
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  userBtnWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  userBtn: {
    borderColor: "#E0BAFD",
    backgroundColor: "#E0BAFD",
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    marginVertical: 15,
  },
  userBtnTxt: {
    color: "#ffffff",
    // fontStyle:"",
    fontWeight: "bold",
    fontSize: 15,
  },
  userInfoWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginVertical: 5,
  },
  userInfoItem: {
    justifyContent: "center",
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default Profile_Screen;
