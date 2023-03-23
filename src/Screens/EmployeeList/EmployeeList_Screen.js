import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Colors } from "../../Assets/Colors/Colors";

import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

import * as Animatable from "react-native-animatable";

import { db, auth } from "../../db/firebaseConfig";
import {
  doc,
  deleteDoc,
  query,
  onSnapshot,
  getDocs,
  collectionGroup,
  where,
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  onSnapshotsInSync,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, ref, deleteObject } from "firebase/storage";
import FitImage from "react-native-fit-image";

const EmployeeList_Screen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const id = await AsyncStorage.getItem("orgId");
        fetchData(id);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataAsync();
  }, []);

  const fetchData = async (id) => {
    const q = query(collection(db, "organization", id, "users"));

    const unsubscribe = onSnapshot(q, (unsubscribe) => {
      setData(
        unsubscribe.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });

    console.log(data);
  };

  const data1 = [
    { id: 1, name: "John Brahm", designation: "Project Manager" },
    { id: 2, name: "Tom Jack", designation: "Software Engineer" },
    { id: 3, name: "Mark Bell", designation: "QA Engineer" },
    { id: 4, name: "Marshall Doe", designation: "Software Engineer" },
    { id: 5, name: "John Dow", designation: "Product Manager" },
    { id: 6, name: "Harry Jam", designation: "Team Lead" },
    { id: 7, name: "Oliver James", designation: "Graphic Designer" },
    { id: 8, name: "Ella Avery", designation: "QA Engineer" },
    { id: 9, name: "William Thomas", designation: "Graphic Designer" },
    { id: 10, name: "Edward Brian", designation: "Team Lead" },
  ];
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{
                marginHorizontal: moderateScale(15),
                marginVertical: moderateScale(8),
              }}
            >
              <Animatable.View
                animation="bounceInUp"
                duration={1000}
                delay={index * 105}
                // iterationCount="infinite"
                style={styles.flatlist}
              >
                <Image
                  source={{ uri: item.data.UserImage }}
                  style={{
                    width: 80,
                    height: 80,
                    borderTopRightRadius: moderateScale(40),
                    borderBottomRightRadius: moderateScale(10),
                  }}
                  resizeMode="contain"
                />
                <Text style={styles.heading2}>
                  {item.data.Lastname} {item.data.Firstname}{" "}
                  {item.data.Middlename}
                </Text>
              </Animatable.View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
export default EmployeeList_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  flatlist: {
    overflow: "hidden",
    // paddingVertical: moderateVerticalScale(14),
    // paddingHorizontal: moderateScale(25),
    borderWidth: 1,
    borderColor: Colors.primaryColor500,
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(150),
    borderBottomRightRadius: moderateScale(30),
    borderBottomLeftRadius: moderateScale(100),
    flexDirection: "row",
    alignItems: "center",
  },
  heading2: {
    fontWeight: "400",
    fontSize: moderateScale(17),
    marginLeft: moderateScale(10),
    marginRight: moderateScale(30),
  },
  subheading: {
    color: "grey",
  },
  itemSeparator: {
    backgroundColor: "#f686bd",
    height: 2,
  },
});
