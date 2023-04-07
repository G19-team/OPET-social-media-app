import { StyleSheet, View, Platform } from "react-native";
import { StatusBar } from "react-native";
import "react-native-gesture-handler";
import { Colors } from "./src/Assets/Colors/Colors";
import { registerRootComponent } from "expo";
import StackNav from "./src/Navigation/StackNav";

import { NavigationContainer } from "@react-navigation/native";

import React from "react";

function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <StackNav />
      </NavigationContainer>
      <StatusBar backgroundColor={Colors.primaryColor500} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: Platform.OS === "web" ? 450 : 0,
    marginVertical: Platform.OS === "web" ? 10 : 0,
  },
});

registerRootComponent(App);

export default App;
