import React from "react";

import { View, Text, Image, StyleSheet } from "react-native";
import MyButton from "../../Components/MyButton";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { Colors } from "../../Assets/Colors/Colors";

const ProfilePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/favicon.png")}
        style={styles.profilePicture}
        resizeMode="cover"
      />
      <Text style={styles.username}>dive</Text>
      <Text style={styles.bio}>Your bio goes here...</Text>
      <MyButton
        title="Edit profile"
        iconSize={moderateScale(20)}
        iconColor={Colors.primaryColor10}
        style={styles.btn}
        fontStyle={styles.fontstyle}
        onPress={() => navigation.navigate("EditProfilePage")}
      />
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>100</Text>
          <Text style={styles.statName}>Posts</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>2k</Text>
          <Text style={styles.statName}>like</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>500</Text>
          <Text style={styles.statName}>dislike</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: "#000000",
    borderWidth: 1,
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
  btn: {
    borderWidth: 0,
    marginVertical: moderateVerticalScale(15),
    paddingVertical: moderateVerticalScale(10),
    backgroundColor: Colors.primaryColor500,
  },
  fontstyle: {
    color: Colors.primaryColor10,
    fontWeight: "900",
  },
});

export default ProfilePage;
