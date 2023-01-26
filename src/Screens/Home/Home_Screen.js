import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { db } from "../../db/firebaseConfig";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";

import FitImage from "react-native-fit-image";
import { scale } from "react-native-size-matters";

const Home_Screen = () => {
  
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
  }, []);
  const [data, setData] = useState([]);

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 5 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: scale(20) }}>Post : </Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((item, key) => (
            <View
              key={key}
              style={{
                borderWidth: 2,
                borderRadius: scale(10),
                padding: 14,
                marginVertical: 10,
              }}
            >
              <FitImage
                source={{ uri: item.data.imageURL }}
                resizeMode="cover"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 6,
                }}
              >
                <Text>Like : </Text>
                <Text>Dislike : </Text>
                <Text>comment : </Text>
              </View>

              <Text>Caption : </Text>
              <Text style={{ fontSize: scale(14) }}>{item.data.caption}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default Home_Screen;
