import { View, Text, RefreshControl, FlatList } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import PostView from "../../Components/PostView";
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
} from "firebase/firestore";
import { db, auth, storage } from "../../db/firebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import FitImage from "react-native-fit-image";
import Stories from "../../Components/Stories";

const Home_Screen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [role, setRole] = useState(null);

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
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setRole(data.Role);
    } else {
      console.log("No such document!");
    }

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
              role={role}
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
                source={require("../../Assets/Img/empty-box.png")}
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

export default Home_Screen;
