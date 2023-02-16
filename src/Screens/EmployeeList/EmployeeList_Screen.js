import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../Assets/Colors/Colors";

const EmployeeList_Screen = () => {
  const data = [
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
        renderItem={({ item }) => {
          return (
            <TouchableOpacity>
              <View style={styles.flatlist}>
                <Text style={styles.heading2}>{item.name}</Text>
                <Text style={styles.subheading}>{item.designation}</Text>
              </View>
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
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryColor500,
  },
  heading2: {
    fontSize: 18,
  },
  subheading: {
    color: "grey",
  },
  itemSeparator: {
    backgroundColor: "#f686bd",
    height: 2,
  },
});
