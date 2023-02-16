import React from "react";
import { ScrollView, Text, View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import users from "../../userList.json";
import Ionicons from "react-native-vector-icons/Ionicons";

const Stories = () => {
  return (
    
      <ScrollView
        style={{
          flex: 1,
          maxHeight: 130,
          backgroundColor: "#ffffff",
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <View style={{ padding: 7, height: 100 }}>
          <Image source={{ uri: "item.photo" }} style={styles.userImage} />
        </View>
        <View style={{ position: "absolute" }}>
          <View style={styles.addbtnContainer}>
            <Ionicons name="add" style={styles.addbtn} />
          </View>
          <Text style={[styles.userName, { textTransform: "capitalize" }]}>
            You Story
          </Text>
        </View>
        {users.map((item, index) => (
          <View
            style={{
              width: 85,
              padding: 5,

              height: 100,
            }}
            key={index}
          >
            <LinearGradient
              colors={["#bc2a8d", "#e95950", "#fccc63"]}
              style={{ padding: 2, borderRadius: 50 }}
            >
              <Image
                source={require("../Assets/Img/OPET_LOGO.png")}
                style={styles.userImage}
              />
            </LinearGradient>
            <Text style={styles.userName}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    
  );
};
export default Stories;

const styles = StyleSheet.create({
  userImage: {
    height: 70,
    width: 70,
    borderRadius: 50,
  },
  userName: {
    textAlign: "center",
    fontSize: 12,
    textTransform: "lowercase",
    margin: 5,
  },
  addbtnContainer: {
    marginTop: 55,
    backgroundColor: "#4c68d7",
    marginLeft: 55,
    width: 23,
    height: 23,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "FFFFFF",
    justifyContent: "center",
  },
  addbtn: {
    color: "#ffffff",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
  },
});
