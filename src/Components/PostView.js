import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";

import { db } from "../db/firebaseConfig";

import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import FitImage from "react-native-fit-image";
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from "react-native-size-matters";

import Ionicons from "@expo/vector-icons/Ionicons";
import { ActivityIndicator } from "react-native";

import { Colors } from "../Assets/Colors/Colors";
import DocumentView from "./DocumentView";
import alert from "../Utills/alert";
import { useNavigation } from "@react-navigation/native";

const PostView = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    const docRef = collection(db, "post");
    onSnapshot(docRef, (post) =>
      setData(
        post.docs.map((post) => ({
          id: post.id,
          data: post.data(),
        }))
      )
    );
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return isLoading ? (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size="large" color={Colors.primaryColor200} />
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <FlatList
        inverted
        data={data}
        renderItem={({ item }) => <Post data={item.data} />}
        keyExtractor={(item) => item.id}
        showsFooterScrollIndicator={false}
        ListFooterComponent={
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
        }
      />
    </View>
  );
};

export default PostView;

const Post = ({ data }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.post}>
      <View style={styles.postheader}>
        <View style={styles.profilepicture}></View>
        <Text style={styles.name}>{data.username}</Text>
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
              navigation.navigate("DocumentViewer_Screen",{url:data.URL});
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
          <TouchableOpacity style={styles.options}>
            <Text>{data.comments} comment</Text>
            <Ionicons name="chatbox-outline" size={moderateScale(25)} />
          </TouchableOpacity>
        </View>
        <View style={styles.postcaption}>
          <Text style={{ fontWeight: "bold", fontSize: scale(16) }}>
            Description :
          </Text>
          <Text style={{ opacity: 0.7, includeFontPadding: true }}>
            {data.caption}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    margin: moderateVerticalScale(10),
    borderRadius: moderateScale(20),
    backgroundColor: "#f8f8f8",
  },
  postheader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
  },
  profilepicture: {
    width: moderateScale(35),
    height: moderateScale(35),
    backgroundColor: "black",
    borderRadius: moderateScale(20),
  },
  name: {
    marginLeft: moderateScale(8),
    fontWeight: "bold",
  },
  postcontent: {
    // paddingVertical: moderateVerticalScale(3),
    borderRadius: 3,
    overflow: "hidden",
  },
  postfooter: {
    paddingHorizontal: moderateScale(25),
    paddingVertical: moderateScale(10),
  },
  postoptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  options: {
    alignItems: "center",
  },
  postcaption: {
    marginTop: moderateVerticalScale(5),
  },
});
