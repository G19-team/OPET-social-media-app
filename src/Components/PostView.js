import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

import FitImage from "react-native-fit-image";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

import * as OpenAnything from "react-native-openanything";

import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";

import { Colors } from "../Assets/Colors/Colors";
import DocumentView from "./DocumentView";
import alert from "../Utills/alert";
import { useNavigation } from "@react-navigation/native";
import Stories from "./Stories";

import { db } from "../db/firebaseConfig";
import {
  collection,
  query,
  getDocs,
  onSnapshot,
  collectionGroup,
  docs,
  where,
  orderBy,
} from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SlideInDown } from "react-native-reanimated";
import MyButton from "./MyButton";
const PostView = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [showComment, setShowComment] = useState(false);

  const visibleComment = () => {
    setShowComment(() => {
      if (showComment == true) {
        return false;
      }
      if (showComment == false) {
        return true;
      }
    });
  };
  useEffect(() => {
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
      <Modal
        transparent={true}
        visible={showComment}
        style={{ zIndex: 2, flex: 1 }}
        animationType="slide"
      >
        <View
          style={{ width: "100%", height: "100%", justifyContent: "flex-end" }}
        >
          <View
            style={{
              elevation: 5,
              width: "100%",
              height: "80%",
              borderWidth: 0.7,
              borderColor: "#000000",
              backgroundColor: "#ffffff",
              borderTopRightRadius: moderateScale(25),
              borderTopLeftRadius: moderateScale(25),
              padding: moderateScale(20),
            }}
          >
            <MyButton title="close" onPress={() => visibleComment()} />
            <Text>Comments!</Text>
          </View>
        </View>
      </Modal>
      <View style={{ flex: 1, zIndex: -2 }}>
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={({ item }) => (
            <Post
              data={item.data}
              visibleComment={visibleComment}
              setShowComment={setShowComment}
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

const Post = ({ data, visibleComment, setShowComment }) => {
  const navigation = useNavigation();
  return (
    <>
      <View style={styles.post}>
        <View style={styles.postheader}>
          <Image
            source={{ uri: data.userimage }}
            resizeMode="cover"
            style={styles.profilepicture}
          />

          <Text style={styles.name}>{data.username}</Text>
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
        <View style={styles.postcontent}>
          {data.fileType === "image" ? (
            <FitImage
              source={{ uri: data.URL }}
              resizeMode="cover"
              style={styles.postcontent}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                OpenAnything.Pdf(data.URL);
                // navigation.navigate("DocumentViewer_Screen", { url: data.URL });
              }}
            >
              <DocumentView
                type={data.fileType}
                name={data.fileName}
                size={1.121212}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.postfooter}>
          <View style={styles.postoptions}>
            <TouchableOpacity style={styles.options}>
              <Text>{data.likes} likes</Text>
              <Ionicons name="thumbs-up-outline" size={moderateScale(25)} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.options}>
              <Text>{data.dislikes} dislikes</Text>
              <Ionicons name="thumbs-down-outline" size={moderateScale(25)} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.options}
              onPress={() => visibleComment()}
            >
              <Text>{data.comments} comment</Text>
              <Ionicons name="chatbox-outline" size={moderateScale(25)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  },
  profilepicture: {
    width: moderateScale(45),
    height: moderateScale(45),
    backgroundColor: "black",
    borderWidth: 1.5,
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
  },
  postcaption: {
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(3),
    // marginTop: moderateVerticalScale(5),
  },
});
