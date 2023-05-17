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

import { moderateScale } from "react-native-size-matters";

import * as Animatable from "react-native-animatable";

import { db } from "../../db/firebaseConfig";
import { query, onSnapshot, collection } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  };

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
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.heading2}>
                    {item.data.Lastname} {item.data.Firstname}{" "}
                    {item.data.Middlename}
                  </Text>
                  <Text
                    style={[
                      styles.heading2,
                      { opacity: 0.6, fontSize: 13, marginTop: 3 },
                    ]}
                  >
                    {item.data.Role} : {item.data.Subrole}
                  </Text>
                </View>
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
    marginRight: moderateScale(110),
  },
  subheading: {
    color: "grey",
  },
  itemSeparator: {
    backgroundColor: "#f686bd",
    height: 2,
  },
});
